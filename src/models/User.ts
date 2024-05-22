import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";
import EventUser from "./EventUser.js";
import Token from "./Token.js";

class User extends Model {
	email!: string;
	id!: number;
	full_name!: string;
	isActivated!: boolean;
	points!: number;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password_hash: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		avatar_url: {
			type: DataTypes.STRING,
		},
		is_activated: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		activation_link: {
			type: DataTypes.STRING,
		},
		points: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		role: {
			type: DataTypes.STRING,
			defaultValue: "user",
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
	},
	{
		sequelize,
		modelName: "User",
		tableName: "users",
	},
);

User.hasMany(EventUser, { foreignKey: "user_id" });
User.hasMany(Token, { foreignKey: "user_id" });
User.sync();

export default User;
