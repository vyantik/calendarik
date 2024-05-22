import { Request, Response } from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const create = async (req: Request, res: Response): Promise<void> => {
	try {
		const product = await Product.create({
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
		});

		res.status(201).json({
			...product.dataValues,
		});
	} catch (error) {
		res.status(500).json({
			message: "Не удалось создать продукт",
			error,
		});
	}
};

export const remove = async (req: Request, res: Response): Promise<void> => {
	try {
		const product = await Product.findByPk(req.params.id);

		if (!product) {
			res.status(404).json({
				message: "Продукт не найден",
			});
			return;
		}

		await product.destroy();

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
		const product = await Product.update(
			{
				name: req.body.name,
				description: req.body.description,
				price: req.body.price,
			},
			{
				where: { id: req.params.id },
			},
		);

		if (!product) {
			res.status(404).json({
				message: "Продукт не найден",
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

export const buyProduct = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const user = await User.findByPk(req.body.user_id);

		if (!user) {
			res.status(404).json({
				message: "Пользователь не найден",
			});
			return;
		}

		const product = await Product.findByPk(req.body.product_id);

		if (!product) {
			res.status(404).json({
				message: "Продукт не найден",
			});
			return;
		}

		if (product.price > user.points) {
			res.status(402).json({
				message: "Недостаточно средств на балансе",
			});
			return;
		}

		user.update({
			points: user.points - product.price,
		});
		res.status(200).json({
			success: true,
		});
	} catch (error) {
		res.status(500).json({
			message: "Не удалось получить пользователей",
		});
	}
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
	try {
		const products = await Product.findAll();

		res.json(products);
	} catch (error) {
		console.log(error);

		res.status(500).json({
			message: "Не удалось получить пользователей",
		});
	}
};
