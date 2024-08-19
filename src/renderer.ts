console.log("Renderer process running");

const fighterUrls = [
  "https://www.sherdog.com/fighter/Jon-Jones-27944",
  "https://www.sherdog.com/fighter/Daniel-Cormier-52311",
  "https://www.sherdog.com/fighter/Alex-Pereira-85128",
  "https://www.sherdog.com/fighter/Anthony-Davis-1060",
  "https://www.sherdog.com/fighter/Anthony-Sullivan-1061",
  "https://www.sherdog.com/fighter/Conor-Mcgregor-1062",
];

const eventUrls = [
  "https://www.ufc.com/event/ufc-239",
  "https://www.ufc.com/event/ufc-240",
  "https://www.ufc.com/event/ufc-250",
  "https://www.ufc.com/event/ufc-264",
  "https://www.ufc.com/event/ufc-271",
  "https://www.ufc.com/event/ufc-290",
  "https://www.ufc.com/event/ufc-300",
];

async function displayFighterData(url: string) {
  const fighterData = await window.api.getFighterData(url);
  console.log(fighterData);

  const contentDiv = document.getElementById("fighter-content");
  if (contentDiv) {
    const fighterDiv = document.createElement("div");
    fighterDiv.classList.add("fighter-section");
    fighterDiv.innerHTML = generateHtmlFromJson(fighterData);
    contentDiv.appendChild(fighterDiv);
  }
}

async function displayEventData(url: string) {
  const eventData = await window.api.getEventData(url);
  console.log(eventData);

  const contentDiv = document.getElementById("event-content");
  if (contentDiv) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("event-section");
    eventDiv.innerHTML = generateHtmlFromJson(eventData);
    contentDiv.appendChild(eventDiv);
  }
}

function generateHtmlFromJson(data: any): string {
  let htmlContent = "<div class='json-section'>";

  for (const key in data) {
    if (Array.isArray(data[key])) {
      htmlContent += `<div class="json-key"><strong>${key}:</strong><ul>`;
      data[key].forEach((item: any) => {
        if (typeof item === "object") {
          htmlContent += "<li>" + generateHtmlFromJson(item) + "</li>";
        } else {
          htmlContent += `<li>${item}</li>`;
        }
      });
      htmlContent += "</ul></div>";
    } else if (typeof data[key] === "object") {
      htmlContent += `<div class="json-key"><strong>${key}:</strong>${generateHtmlFromJson(
        data[key]
      )}</div>`;
    } else {
      htmlContent += `<div class="json-key"><strong>${key}:</strong> ${data[key]}</div>`;
    }
  }

  htmlContent += "</div>";
  return htmlContent;
}

// Search functionality implementation
async function searchFighterOrEvent(query: string) {
  const resultsDiv = document.getElementById("search-results");
  if (resultsDiv) {
    resultsDiv.innerHTML = ""; // Clear previous results

    // Search fighters
    for (const url of fighterUrls) {
      const fighterData = await window.api.getFighterData(url);
      if (fighterData.name.toLowerCase().includes(query.toLowerCase())) {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("fighter-section");
        resultDiv.innerHTML = generateHtmlFromJson(fighterData);
        resultsDiv.appendChild(resultDiv);
      }
    }

    // Search events
    for (const url of eventUrls) {
      const eventData = await window.api.getEventData(url);
      if (eventData.name.toLowerCase().includes(query.toLowerCase())) {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("event-section");
        resultDiv.innerHTML = generateHtmlFromJson(eventData);
        resultsDiv.appendChild(resultDiv);
      }
    }

    if (resultsDiv.innerHTML === "") {
      resultsDiv.innerHTML = "<p>No results found.</p>";
    }
  }
}

window.onload = () => {
  const searchButton = document.getElementById("search-button");
  const searchBar = document.getElementById("search-bar") as HTMLInputElement;

  searchButton?.addEventListener("click", () => {
    const query = searchBar.value.trim();
    if (query) {
      searchFighterOrEvent(query);
    }
  });

  fighterUrls.forEach(displayFighterData);
  eventUrls.forEach(displayEventData);
};
