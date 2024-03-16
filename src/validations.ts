import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 })
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('full_name', 'Укажите имя').isLength({ min: 3 }),
    body('avatar_url', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const eventValidation = [
    body('title', 'Введите название').isString(),
    body('description', 'Введите описание').optional().isString(),
];