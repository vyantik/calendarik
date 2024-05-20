import { validationResult } from "express-validator";
import User from "../models/User.js";
import Event from "../models/Event.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UserService from "../services/user-service.js";
import UserDto from "../utils/user-dto.js";
import TokenService from "../services/token-service.js";
import EventUser from "../models/EventUser.js";
import EventService from "../services/event-service.js";
import Comment from "../models/Comment.js";

export const register = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}
		const userData = await UserService.registration(req);

		res.cookie("refreshToken", userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		return res.status(201).json(userData);
	} catch (err) {
		return res.status(500).json({
			message: "Не удалось зарегистрироваться",
		});
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}
		const user = await User.findOne({ where: { email: req.body.email } });

		if (!user) {
			return res.status(404).json({
				message: "Неверный логин или пароль",
			});
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user.dataValues.password_hash,
		);

		if (!isValidPass) {
			return res.status(400).json({
				message: "Неверный логин или пароль",
			});
		}

		const userDto = new UserDto(user);

		const tokens = await TokenService.generateTokens({ ...userDto });

		await TokenService.saveToken(userDto.id, tokens.refreshToken);
		res.cookie("refreshToken", tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		return res.status(200).json({ ...tokens, user: userDto });
	} catch (error) {
		return res.status(500).json({
			message: "Не удалось авторизоваться",
		});
	}
};

export const getMe = async (req: Request, res: Response): Promise<Response> => {
	try {
		const user = await User.findByPk(req.body.userId);

		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден",
			});
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password_hash, ...userData } = user.dataValues;

		return res.json(userData);
	} catch (error) {
		return res.status(500).json({
			message: "Нет доступа",
		});
	}
};

export const activate = async (req: Request, res: Response) => {
	try {
		const activationLink = req.params.link;

		await UserService.activate(activationLink);

		return res.redirect(process.env.API_URL || "http://localhost/");
	} catch (error) {
		console.log(error);
	}
};

export const refresh = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { refreshToken } = req.cookies;

		const userData = await UserService.refresh(refreshToken);
		res.cookie("refreshToken", userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		return res.json(userData);
	} catch (error) {
		return res.status(500).json({
			message: "Нет доступа",
			error,
		});
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		const { refreshToken } = req.cookies;

		const token = await UserService.logout(refreshToken);

		res.clearCookie("refreshToken");

		return res.json(token);
	} catch (error) {
		return res.status(500).json({
			message: "Нет доступа",
			err: error,
		});
	}
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
	try {
		const event = await Event.findOne({
			where: {
				id: req.body.event_id,
			},
		});

		if (!event) {
			res.status(404).json({
				message: "Такого мероприятия не существует",
			});
			return;
		}

		const eventUserTest = await EventUser.findOne({
			where: {
				event_id: req.body.event_id,
				user_id: req.body.user_id,
			},
		});

		if (eventUserTest) {
			res.status(409).json({
				message: "Уже записан",
			});
			return;
		}

		const eventUser = await EventUser.create({
			event_id: req.body.event_id,
			user_id: req.body.user_id,
		});

		if (!eventUser) {
			res.status(404).json({
				message: "Не удалось записаться на мероприятие",
			});
			return;
		}

		res.json({
			message: "Успешно",
		});
	} catch (err) {
		res.status(500).json({
			error: err,
			message: "Непредвиденная ошибка",
		});
	}
};

export const unsubscribe = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const eventUser = await EventUser.destroy({
			where: {
				event_id: req.body.event_id,
				user_id: req.body.user_id,
			},
		});

		if (!eventUser) {
			res.status(404).json({
				message: "Не удалось получить мероприятие",
			});
			return;
		}

		res.json({
			message: "Успешно",
		});
	} catch (err) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};

export const getPoints = async (req: Request, res: Response): Promise<void> => {
	try {
		const user = await User.findByPk(req.params.id);

		if (!user) {
			res.status(404).json({
				message: "Пользователь не найден",
			});
			return;
		}

		res.json({
			points: user.dataValues.points,
		});
	} catch (error) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};

export const addComment = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const user = await User.findOne({
			where: {
				id: req.body.user_id,
			},
		});

		if (!user) {
			res.status(404).json({
				message: "Пользователь не найден",
			});
			return;
		}

		const event = await Event.findOne({
			where: {
				id: req.body.event_id,
			},
		});

		if (!event) {
			res.status(404).json({
				message: "Такого мероприятия не существует",
			});
			return;
		}

		const eventUser = await EventUser.findOne({
			where: {
				event_id: req.body.event_id,
				user_id: req.body.user_id,
			},
		});

		if (!eventUser) {
			res.status(200).json({
				message: "Пользователь не записан",
			});
			return;
		}

		if (eventUser.dataValues.visited === false) {
			res.status(200).json({
				message: "Пользователь не посетил",
			});
			return;
		}

		if (!req.body.comment) {
			res.status(400).json({
				message: "Нет комментария",
			});
			return;
		}

		const comment = await Comment.create({
			event_id: req.body.event_id,
			user_id: req.body.user_id,
			comment: req.body.comment,
		});

		if (!comment) {
			res.status(500).json({
				message: "Непредвиденная ошибка",
			});
			return;
		}

		res.json({
			...comment.dataValues,
		});
	} catch (error) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};

export const deleteComment = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const comment = await Comment.findOne({
			where: {
				id: req.body.comment_id,
			},
		});

		if (!comment) {
			res.status(404).json({
				message: "комментарий не найден",
			});
			return;
		}

		await comment.destroy();

		res.json({
			success: true,
		});

		res.json({
			...comment.dataValues,
		});
	} catch (error) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};

export const getSignedEvents = async (
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

export const getVisitedEvents = async (
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
	} catch (err) {
		res.status(500).json({
			message: "Непредвиденная ошибка",
		});
	}
};
