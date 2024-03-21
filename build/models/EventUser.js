import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';
class EventUser extends Model {
}
EventUser.init({
    event_id: {
        type: DataTypes.INTEGER,
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    visited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    sequelize,
    modelName: 'EventUser',
    tableName: 'eventUser'
});
EventUser.sync({ force: true });
export default EventUser;
//# sourceMappingURL=EventUser.js.map