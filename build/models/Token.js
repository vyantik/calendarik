import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';
class Token extends Model {
}
Token.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize,
    modelName: 'Token',
    tableName: 'tokens'
});
Token.sync({ force: true });
export default Token;
//# sourceMappingURL=Token.js.map