import axios from "axios";
import cheerio from "cheerio";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
};

async function fetchHtml(url: string): Promise<cheerio.Root> {
  const { data } = await axios.get(url, { headers });
  return cheerio.load(data);
}

interface FightDetails {
  weightclass: string;
  redCorner: {
    name: string;
    ranking: string;
    odds: string;
    link: string;
    result?: string;
  };
  blueCorner: {
    name: string;
    ranking: string;
    odds: string;
    link: string;
    result?: string;
  };
  round?: string;
  time?: string;
  method?: string;
}

interface Event {
  name: string;
  date: string;
  location: string;
  venue: string;
  fights: FightDetails[];
}

export class EventModel {
  static async getUpcomingEventLinks(): Promise<string[]> {
    const url = "https://www.ufc.com/events";
    const $ = await fetchHtml(url);
    return $(
      "details#events-list-upcoming div div div div div section ul li article div:nth-child(1) div a"
    )
      .map(
        (_, el: cheerio.Element) => `https://www.ufc.com${$(el).attr("href")}`
      )
      .get();
  }

  static async parseEvent(url: string, past: boolean = true): Promise<Event> {
    const $ = await fetchHtml(url);

    const prefix = $(".c-hero__header div:nth-child(1) div h1").text().trim();
    const names = $(".c-hero__header div:nth-child(2) span span")
      .map((_, el: cheerio.Element) => $(el).text().trim())
      .get();
    const name = `${prefix}: ${names[0]} vs. ${names[names.length - 1]}`;

    const date = new Date(
      parseInt(
        $(".c-hero__bottom-text div:nth-child(1)").attr("data-timestamp")!,
        10
      )
    )
      .toISOString()
      .split("T")[0];
    const location = $(".c-hero__bottom-text div:nth-child(2) div")
      .text()
      .split(",");

    const event: Event = {
      name,
      date,
      location: location[1].trim(),
      venue: location[0].trim(),
      fights: [],
    };

    $("div.fight-card div div section ul li").each(
      (_, fight: cheerio.Element) => {
        const fightDetails: FightDetails = {
          weightclass: $(fight)
            .find(
              "div div div div:nth-child(2) div:nth-child(2) div:nth-child(1) div:nth-child(2)"
            )
            .text()
            .slice(0, -5),
          redCorner: {
            name: $(fight)
              .find(
                "div div div div:nth-child(2) div:nth-child(2) div:nth-child(5) div:nth-child(1) a span"
              )
              .text()
              .trim(),
            ranking:
              $(fight)
                .find(
                  "div div div div:nth-child(2) div:nth-child(2) div:nth-child(2) div:nth-child(1) span"
                )
                .text()
                .substring(1) || "Unranked",
            odds: $(fight)
              .find(
                "div div div div:nth-child(4) div:nth-child(2) span:nth-child(1) span"
              )
              .text(),
            link: $(fight)
              .find(
                "div div div div:nth-child(2) div:nth-child(2) div:nth-child(5) div:nth-child(1) a"
              )
              .attr("href")!,
          },
          blueCorner: {
            name: $(fight)
              .find(
                "div div div div:nth-child(2) div:nth-child(2) div:nth-child(5) div:nth-child(3) a span"
              )
              .text()
              .trim(),
            ranking:
              $(fight)
                .find(
                  "div div div div:nth-child(2) div:nth-child(2) div:nth-child(2) div:nth-child(2) span"
                )
                .text()
                .substring(1) || "Unranked",
            odds: $(fight)
              .find(
                "div div div div:nth-child(4) div:nth-child(2) span:nth-child(3) span"
              )
              .text(),
            link: $(fight)
              .find(
                "div div div div:nth-child(2) div:nth-child(2) div:nth-child(5) div:nth-child(3) a"
              )
              .attr("href")!,
          },
        };

        if (past) {
          fightDetails.round = $(fight)
            .find(
              "div div div div:nth-child(2) .c-listing-fight__result-text.round"
            )
            .text();
          fightDetails.time = $(fight)
            .find(
              "div div div div:nth-child(2) .c-listing-fight__result-text.time"
            )
            .text();
          fightDetails.method = $(fight)
            .find(
              "div div div div:nth-child(2) .c-listing-fight__result-text.method"
            )
            .text();
          fightDetails.redCorner.result = $(fight)
            .find(
              "div div div div:nth-child(2) .c-listing-fight__outcome-wrapper div:nth-child(1)"
            )
            .text()
            .trim();
          fightDetails.blueCorner.result = $(fight)
            .find(
              "div div div div:nth-child(2) .c-listing-fight__outcome-wrapper div:nth-child(2)"
            )
            .text()
            .trim();
        }

        event.fights.push(fightDetails);
      }
    );

    return event;
  }

  static async search(query: string): Promise<string[]> {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const $ = await fetchHtml(url);
    return $("h3")
      .parent("a")
      .map((_, el: cheerio.Element) => $(el).attr("href")!)
      .get();
  }

  static async getUfcLinkEvent(query: string): Promise<string> {
    const possibleUrls = await this.search(`${query} UFC`);
    for (const url of possibleUrls) {
      if (url.includes("ufc.com/event/")) {
        return url;
      }
    }
    throw new Error("UFC link not found!");
  }
}
