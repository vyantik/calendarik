import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

class Comment extends Model {
	id!: number;
	user_name!: string;
	comment!: string;
}

Comment.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		event_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		comment: {
			type: DataTypes.STRING(1000),
			allowNull: false,
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
		modelName: "Comment",
		tableName: "comments",
	},
);

Comment.sync();

export default Comment;
