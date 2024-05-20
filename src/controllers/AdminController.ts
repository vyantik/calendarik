import { Request, Response } from "express";
import User from "../models/User.js";
import EventUser from "../models/EventUser.js";

export const getAll = async (req: Request, res: Response): Promise<void> => {
	try {
		const users = await User.findAll();

		if (!users) {
			res.status(404).json({
				message: "Пользователей не найдено",
			});
			return;
		}

		res.json(
			users.map((item) => ({
				id: item.dataValues.id,
				full_name: item.dataValues.full_name,
			})),
		);
	} catch (error) {
		res.status(500).json({
			message: "Не удалось получить пользователей",
		});
	}
};

export const setVisited = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const eventUser = await EventUser.findOne({
			where: {
				event_id: req.body.event_id,
				user_id: req.body.user_id,
			},
		});

		if (!eventUser) {
			res.status(404).json({
				message: "Пользователь не записан",
			});
			return;
		}

		const user = await User.findByPk(req.body.user_id);

		if (!user) {
			res.status(404).json({
				message: "Пользователь не найден",
			});
			return;
		}

		user.update({
			points: user.points + 5,
		});

		eventUser.update({
			visited: req.body.visited,
		});

		res.status(200).json({
			message: "Изменено",
		});
	} catch (error) {
		res.status(500).json({
			message: "Не удалось получить пользователей",
		});
	}
};
