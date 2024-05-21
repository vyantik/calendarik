import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Event from "../models/Event.js";
import EventUser from "../models/EventUser.js";
import UserFal from "../utils/user-fal.js";
import EventService from "../services/event-service.js";
import Comment from "../models/Comment.js";
import CommentService from "../services/comment-service.js";

export const create = async (req: Request, res: Response): Promise<void> => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json(errors.array());
			return;
		}

		const event = await Event.create({
			title: req.body.title,
			start: req.body.start,
			end: req.body.end,
			resource: req.body.resource,
			description: req.body.description,
		});

		res.status(201).json({
			...event.dataValues,
		});
	} catch (error) {
		res.status(500).json({
			message: "Не удалось создать мероприятие",
			error,
		});
	}
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
	try {
		const events = await Event.findAll();

		res.json(events);
	} catch (error) {
		res.status(500).json({
			message: "Не удалось получить мероприятия",
		});
	}
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
	try {
		const event = await Event.findByPk(req.params.id);

		if (!event) {
			res.status(404).json({
				message: "Событие не найдено",
			});
			return;
		}

		res.json(event.dataValues);
	} catch (err) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};

export const remove = async (req: Request, res: Response): Promise<void> => {
	try {
		const event = await Event.findByPk(req.params.id);
		const eventUsers = await EventUser.findAll({
			where: { event_id: req.params.id },
		});

		if (!event) {
			res.status(404).json({
				message: "Событие не найдено",
			});
			return;
		}

		for (const eventUser of eventUsers) {
			await eventUser.destroy();
		}

		await event.destroy();

		res.json({
			success: true,
		});
	} catch (err) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};

export const update = async (req: Request, res: Response): Promise<void> => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json(errors.array());
			return;
		}

		const event = await Event.update(
			{
				title: req.body.title,
				start: req.body.start,
				end: req.body.end,
				resource: req.body.resource,
				description: req.body.description,
			},
			{
				where: { id: req.params.id },
			},
		);

		if (!event) {
			res.status(404).json({
				message: "Событие не найдено",
			});
			return;
		}

		res.json({
			success: true,
		});
	} catch (err) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};

export const getAllUsers = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const events = await EventUser.findAll({
			where: {
				event_id: req.params.id,
			},
		});

		if (events.length === 0) {
			res.status(404).json({
				message: "Никто не посетил",
			});
			return;
		}

		if (!events) {
			res.status(404).json({
				message: "Мероприятие не найдено",
			});
			return;
		}

		const users: UserFal[] = await EventService.usersById(events);

		res.json(users);
	} catch (error) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};

export const getAllVisited = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const eventUser = await EventUser.findAll({
			where: {
				user_id: req.params.id,
				visited: true,
			},
		});

		if (eventUser.length === 0 || !eventUser) {
			res.status(404).json({
				message: "Не посетил мероприятий",
			});
			return;
		}

		const events = await EventService.eventsById(eventUser);

		res.json(events);
	} catch (error) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};

export const getAllSigned = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const eventUser = await EventUser.findAll({
			where: {
				user_id: req.params.id,
			},
		});

		if (eventUser.length === 0 || !eventUser) {
			res.status(404).json({
				message: "Не посетил мероприятий",
			});
			return;
		}

		const events = await EventService.eventsById(eventUser);

		res.json(events);
	} catch (err) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};

export const getComments = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const comments = await Comment.findAll({
			where: {
				event_id: req.params.id,
			},
		});

		if (!comments) {
			res.status(404).json({
				message: "комментарии не найдены",
			});
			return;
		}

		const comments_dto = await CommentService.get_comments_dto(comments);

		res.json(comments_dto);
	} catch (error) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};
