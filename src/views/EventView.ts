import { EventController } from '../controllers/EventController';

export class EventView {
    static async displayUpcomingEvents() {
        const events = await EventController.getUpcomingEvents();
        console.log(events);
    }

    static async displayEvent(query: string) {
        const event = await EventController.getEvent(query);
        console.log(event);
    }
}
