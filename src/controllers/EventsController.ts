import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Event from "../models/Event.js";
import User from "../models/User.js";
import EventUser from "../models/EventUser.js";
import UserFal from "../utils/user-fal.js";
import EventService from "../services/event-service.js";

export const createEvent = async (
	req: Request,
	res: Response,
): Promise<void> => {
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

export const signUp = async (req: Request, res: Response): Promise<void> => {
	try {
		const user = await User.findByPk(req.body.userId);

		if (!user) {
			res.status(404).json({
				message: "Пользователь не найден",
			});
			return;
		}

		const event = await Event.findByPk(req.params.id);

		if (!event) {
			res.status(404).json({
				message: "Событие не найдено",
			});
			return;
		}

		if (event.dataValues.partipitions.includes(req.body.userId)) {
			res.status(409).json({
				message: "Пользователь уже записан на это событие",
			});
			return;
		}

		event.update({
			partipitions: event.dataValues.partipitions.concat(req.body.userId),
		});

		res.json({ message: "Пользователь записан" });
	} catch (error) {
		res.status(500).json({
			message: "Нет доступа",
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

		if (!event) {
			res.status(404).json({
				message: "Событие не найдено",
			});
			return;
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

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
	const events = await EventUser.findAll({where: {
		event_id: req.params.id,
		visited: true
	}});

	if(events.length === 0){
		res.status(404).json({
			message: "Никто не посетил",
		});
		return
	}

	if(!events){
		res.status(404).json({
			message: "Мероприятие не найдено",
		});
		return
	}

	const users: UserFal[] = await EventService.usersById(events);

	res.json(users);
};