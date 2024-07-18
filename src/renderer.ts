console.log("Renderer process running");

const fighterUrls = [
  "https://www.sherdog.com/fighter/Jon-Jones-27944", // Replace with the desired fighter URLs
  "https://www.sherdog.com/fighter/Daniel-Cormier-52311",
  "https://www.sherdog.com/fighter/Alex-Pereira-85128", // Added Alex Pereira
  "https://www.sherdog.com/fighter/Anthony-Davis-1060",
  "https://www.sherdog.com/fighter/Anthony-Sullivan-1061",
  "https://www.sherdog.com/fighter/Conor-Mcgregor-1062",

  // Add more fighter URLs as needed
];

const eventUrls = [
  "https://www.ufc.com/event/ufc-239", // Replace with the desired event URLs
  "https://www.ufc.com/event/ufc-240",
  "https://www.ufc.com/event/ufc-250",
  "https://www.ufc.com/event/ufc-264",
  "https://www.ufc.com/event/ufc-271",
  "https://www.ufc.com/event/ufc-290",
  "https://www.ufc.com/event/ufc-300",
  // Add more event URLs as needed
];

async function displayFighterData(url: string) {
  const fighterData = await window.api.getFighterData(url);
  console.log(fighterData); // For debugging purposes

  const contentDiv = document.getElementById("fighter-content");
  if (contentDiv) {
    const fighterDiv = document.createElement("div");
    fighterDiv.innerHTML = generateHtmlFromJson(fighterData);
    contentDiv.appendChild(fighterDiv);
  }
}

async function displayEventData(url: string) {
  const eventData = await window.api.getEventData(url);
  console.log(eventData); // For debugging purposes

  const contentDiv = document.getElementById("event-content");
  if (contentDiv) {
    const eventDiv = document.createElement("div");
    eventDiv.innerHTML = generateHtmlFromJson(eventData);
    contentDiv.appendChild(eventDiv);
  }
}

function generateHtmlFromJson(data: any): string {
  let htmlContent = "<div>";

  for (const key in data) {
    if (Array.isArray(data[key])) {
      htmlContent += `<div><strong>${key}:</strong><ul>`;
      data[key].forEach((item: any) => {
        if (typeof item === "object") {
          htmlContent += "<li>" + generateHtmlFromJson(item) + "</li>";
        } else {
          htmlContent += `<li>${item}</li>`;
        }
      });
      htmlContent += "</ul></div>";
    } else if (typeof data[key] === "object") {
      htmlContent += `<div><strong>${key}:</strong>${generateHtmlFromJson(
        data[key]
      )}</div>`;
    } else {
      htmlContent += `<div><strong>${key}:</strong> ${data[key]}</div>`;
    }
  }

  htmlContent += "</div>";
  return htmlContent;
}

window.onload = () => {
  fighterUrls.forEach(displayFighterData); // Fetch and display data for all fighters
  eventUrls.forEach(displayEventData); // Fetch and display data for all events
};
