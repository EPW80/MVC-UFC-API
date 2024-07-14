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

interface Fighter {
  name: string;
  nickname: string;
  nationality: string;
  birthplace: string;
  birthdate: string;
  age: string;
  height: string;
  weight: string;
  association: string;
  weightClass: string;
  wins: Record<string, string>;
  losses: Record<string, string>;
  fights: Record<string, string>[];
}

interface UFCStats {
  strikes: Record<string, string>;
  takedowns: Record<string, string>;
}

export class FighterModel {
  static async parseSherdogFighter(url: string): Promise<Fighter> {
    const $ = await fetchHtml(url);

    const winsDetailed = $("div.wins .meter div:nth-child(1)")
      .map((_, el: cheerio.Element) => $(el).text())
      .get();
    const lossesDetailed = $("div.loses .meter div:nth-child(1)")
      .map((_, el: cheerio.Element) => $(el).text())
      .get();
    const bio = $(".fighter-info").first();

    const otherWins = winsDetailed[3] || "0";
    const otherLosses = lossesDetailed[3] || "0";

    const fighter: Fighter = {
      name: $("span.fn").text(),
      nickname: bio.find("span.nickname em").text(),
      nationality: bio.find('strong[itemprop="nationality"]').text(),
      birthplace: $("span.locality").text(),
      birthdate: $('span[itemprop="birthDate"]').text(),
      age: $('span[itemprop="birthDate"]').prev("b").text(),
      height: $('b[itemprop="height"]').text(),
      weight: $('b[itemprop="weight"]').text(),
      association: $('span[itemprop="memberOf"] a span').text(),
      weightClass: $("div.association-class a").text(),
      wins: {
        total: $("div.winloses.win span:nth-child(2)").text(),
        koTko: winsDetailed[0],
        submissions: winsDetailed[1],
        decisions: winsDetailed[2],
        others: otherWins,
      },
      losses: {
        total: $("div.winloses.lose span:nth-child(2)").text(),
        koTko: lossesDetailed[0],
        submissions: lossesDetailed[1],
        decisions: lossesDetailed[2],
        others: otherLosses,
      },
      fights: [],
    };

    $("table.new_table.fighter tr:not(.table_head)").each(
      (_, row: cheerio.Element) => {
        const referee = $(row).find("td:nth-child(4) span a").text() || "";

        const fight = {
          name: $(row).find("td:nth-child(3) a").text(),
          date: $(row).find("td:nth-child(3) span").text(),
          url: `https://www.sherdog.com${$(row)
            .find("td:nth-child(3) a")
            .attr("href")}`,
          result: $(row).find("td:nth-child(1) span").text(),
          method: $(row).find("td:nth-child(4) b").text(),
          referee: referee,
          round: $(row).find("td:nth-child(5)").text(),
          time: $(row).find("td:nth-child(6)").text(),
          opponent: $(row).find("td:nth-child(2) a").text(),
        };

        fighter.fights.push(fight);
      }
    );

    return fighter;
  }

  static async getUfcStats(url: string): Promise<UFCStats> {
    const $ = await fetchHtml(url);

    const distance = $(".c-stat-3bar__value")
      .map((_, el: cheerio.Element) => $(el).text())
      .get();
    const stats = $(".c-stat-compare__number")
      .map((_, el: cheerio.Element) => $(el).text())
      .get();

    const strTds: string[] = [];
    $("dd").each((_, el: cheerio.Element) => {
      strTds.push($(el).text() || "0");
    });

    const fighter: UFCStats = {
      strikes: {
        attempted: strTds[1],
        landed: strTds[0],
        standing: distance[0].split(" ")[0],
        clinch: distance[1].split(" ")[0],
        ground: distance[2].split(" ")[0],
        strikingDefense: stats[4].trim(),
        strikesPerMinute: stats[0].trim(),
      },
      takedowns: {
        attempted: strTds[3],
        landed: strTds[2],
        takedownDefense: stats[5].trim(),
        subsPer15min: stats[3].trim(),
      },
    };

    return fighter;
  }

  static async search(query: string): Promise<string[]> {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const $ = await fetchHtml(url);
    return $("h3")
      .parent("a")
      .map((_, el: cheerio.Element) => $(el).attr("href")!)
      .get();
  }

  static async getSherdogLink(query: string): Promise<string> {
    const possibleUrls = await this.search(`${query} Sherdog`);
    for (const url of possibleUrls) {
      if (url.includes("sherdog.com/fighter/") && !url.includes("/news/")) {
        return url;
      }
    }
    throw new Error("Sherdog link not found!");
  }

  static async getUfcLink(query: string): Promise<string> {
    const possibleUrls = await this.search(`${query} UFC.com`);
    for (const url of possibleUrls) {
      if (url.includes("ufc.com/athlete/")) {
        return url;
      }
    }
    throw new Error("UFC link not found!");
  }
}
