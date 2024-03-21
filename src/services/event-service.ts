import EventUser from "../models/EventUser.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import EventDto from "../utils/event-dto.js";
import ApiError from "../utils/exceptions/exceptions.js";
import UserFal from "../utils/user-fal.js";

class EventService {
    static async usersById(eventUsersId: EventUser[]): Promise<UserFal[]> {
        const users: UserFal[] = [];

        for(const event of eventUsersId){
            const user = await User.findByPk(event.dataValues.user_id);

            if(!user){
                throw ApiError.NotFound('Пользователь не найден');
            }

            users.push(new UserFal(user));
        }

        return users;
    }

    static async eventsById(eventsId: EventUser[]): Promise<EventDto[]> {
        const events: EventDto[] = [];
        for(const eventUser of eventsId){
            const event = await Event.findByPk(eventUser.dataValues.event_id);

            if(!event){
                throw ApiError.NotFound('Мероприятия не найден');
            }
            
            events.push(new EventDto(event));
        }

        return events;
    }

}

export default EventService;