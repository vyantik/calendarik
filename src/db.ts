import { Sequelize } from "sequelize";
import cli from "cli-color";

import * as dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize("calendarik", "postgres", process.env.DB_PASSWORD, {
	host: "localhost",
	dialect: "postgres",
	logging: false,
});

if (sequelize != null) {
	console.clear();
	console.log(cli.green("DB OK"));
}
