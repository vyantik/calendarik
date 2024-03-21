import { Sequelize } from "sequelize";
import cli from "cli-color";

export const sequelize = new Sequelize("calendarik", "postgres", "49ANoIGLtMDJ0HEJ", {
	host: "localhost",
	dialect: "postgres",
	logging: false,
});

if (sequelize != null) {
	console.clear();
	console.log(cli.green("DB OK"));
}
