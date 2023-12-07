import { validationResult } from "express-validator";
import Event from "../models/Event.js";
import User from "../models/User.js";
export const createEvent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }
        const event = await Event.create({
            title: req.body.title,
            event_date: req.body.event_date,
            description: req.body.description,
            image_url: req.body.image_url,
        });
        res.status(201).json({
            ...event.dataValues,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Не удалось создать мероприятие",
        });
    }
};
export const getAll = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    }
    catch (error) {
        res.status(500).json({
            message: "Не удалось получить мероприятия",
        });
    }
};
export const signUp = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};
export const getOne = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            res.status(404).json({
                message: "Событие не найдено",
            });
            return;
        }
        res.json(event.dataValues);
    }
    catch (err) {
        res.status(500).json({
            message: "Непредвиденная ошибка",
        });
    }
};
export const remove = async (req, res) => {
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
    }
    catch (err) {
        res.status(500).json({
            message: "Непредвиденная ошибка",
        });
    }
};
export const update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }
        const event = await Event.update({
            title: req.body.title,
            event_date: req.body.event_date,
            description: req.body.description,
            image_url: req.body.image_url,
        }, {
            where: { id: req.params.id },
        });
        if (!event) {
            res.status(404).json({
                message: "Событие не найдено",
            });
            return;
        }
        res.json({
            success: true,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Непредвиденная ошибка",
        });
    }
};
//# sourceMappingURL=EventsController.js.map