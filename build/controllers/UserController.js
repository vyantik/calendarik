import { validationResult } from "express-validator";
import User from '../models/User.js';
import bcrypt from "bcrypt";
import UserService from "../services/user-service.js";
import UserDto from "../utils/user-dto.js";
import TokenService from "../services/token-service.js";
import EventUser from "../models/EventUser.js";
import EventService from "../services/event-service.js";
export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const userData = await UserService.registration(req);
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.status(201).json(userData);
    }
    catch (err) {
        return res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        });
    }
};
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            });
        }
        const isValidPass = await bcrypt.compare(req.body.password, user.dataValues.password_hash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            });
        }
        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.status(200).json({ ...tokens, user: userDto });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
};
export const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.body.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
        const { password_hash, ...userData } = user.dataValues;
        return res.json(userData);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Нет доступа'
        });
    }
};
export const activate = async (req, res) => {
    try {
        const activationLink = req.params.link;
        await UserService.activate(activationLink);
        return res.redirect(process.env.API_URL || 'http://localhost/');
    }
    catch (error) {
        console.log(error);
    }
};
export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = await UserService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Нет доступа',
            error
        });
    }
};
export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await UserService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.json(token);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Нет доступа',
            err: error
        });
    }
};
export const getAllSigned = async (req, res) => {
    const eventUser = await EventUser.findAll({ where: {
            user_id: req.body.id,
            visited: true
        } });
    if (eventUser.length === 0 || !eventUser) {
        res.status(404).json({
            message: 'Не посетил мероприятий'
        });
    }
    const events = await EventService.eventsById(eventUser);
    res.json(events);
};
//# sourceMappingURL=UserController.js.map