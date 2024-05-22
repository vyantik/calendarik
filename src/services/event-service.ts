import EventUser from "../models/EventUser.js";
import Event from "../models/Event.js";
import EventDto from "../utils/event-dto.js";
import ApiError from "../utils/exceptions/exceptions.js";

class EventService {
	static async eventsById(eventsId: EventUser[]): Promise<EventDto[]> {
		const events: EventDto[] = [];
		for (const eventUser of eventsId) {
			const event = await Event.findByPk(eventUser.dataValues.event_id);

			if (!event) {
				throw ApiError.NotFound("Мероприятия не найден");
			}

			events.push(new EventDto(event));
		}

		return events;
	}
}

export default EventService;
