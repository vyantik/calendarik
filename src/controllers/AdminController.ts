import { Request, Response } from "express";
import User from "../models/User.js";

export const getAll = async (req: Request, res: Response): Promise<void> => {
	try {
		const users = await User.findAll();

        if(!users){
            res.status(404).json({
                message: "Пользователей не найдено",
            });
        }

		res.json(users.map(item => ({id: item.dataValues.id, full_name: item.dataValues.full_name})));
	} catch (error) {
		res.status(500).json({
			message: "Не удалось получить пользователей",
		});
	}
};