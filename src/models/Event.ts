import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

class Event extends Model {
	id!: number;
	title!: string;
}

Event.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		start: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		resource: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
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
		modelName: "Event",
		tableName: "events",
	},
);

Event.sync({ force: true });

export default Event;
