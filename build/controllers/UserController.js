import { validationResult } from "express-validator";
import User from '../models/User.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import UserService from "../services/user-service.js";
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
            message: 'Не удалось зарегистрироваться'
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
        const token = jwt.sign({
            id: user.dataValues.id
        }, 'secret123', {
            expiresIn: '30d'
        });
        const { password_hash, ...userData } = user.dataValues;
        return res.json({
            ...userData,
            token,
        });
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
        res.clearCookie('refreshToken');
    }
    catch (error) {
        return res.status(500).json({
            message: 'Нет доступа'
        });
    }
};
export const refresh = async (req, res) => {
    try {
        res.clearCookie('refreshToken');
    }
    catch (error) {
        return res.status(500).json({
            message: 'Нет доступа'
        });
    }
};
export const logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken');
    }
    catch (error) {
        return res.status(500).json({
            message: 'Нет доступа'
        });
    }
};
//# sourceMappingURL=UserController.js.map