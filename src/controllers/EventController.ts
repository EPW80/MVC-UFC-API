import { EventModel } from "../models/EventModel";

export class EventController {
  static async getUpcomingEvents() {
    const links = await EventModel.getUpcomingEventLinks();
    const results: { [key: string]: any } = {};

    for (const url of links) {
      const event = await EventModel.parseEvent(url, false);
      results[event.name] = event;
    }

    return results;
  }

  static async getEvent(query: string) {
    const link = await EventModel.getUfcLinkEvent(query);
    return EventModel.parseEvent(link);
  }
}
