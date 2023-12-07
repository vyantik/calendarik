import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';
class User extends Model {
}
User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    avatar_url: {
        type: DataTypes.STRING(255)
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
});
User.sync();
export default User;
//# sourceMappingURL=User.js.map