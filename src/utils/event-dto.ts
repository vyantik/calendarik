import Event from "../models/Event.js";

class EventDto{
    id: number;
    title: string;

    constructor(model: Event) {
        this.id = model.id;
        this.title = model.title;
    }
}

export default EventDto;