import TokenService from "../services/token-service.js";
import CustomRequest from "./custom-request.js";
import ApiError from "./exceptions/exceptions.js";
import { NextFunction, Response } from "express";

export default function (
	req: CustomRequest,
	res: Response,
	next: NextFunction,
): void {
	try {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader) {
			return next(ApiError.UnauthorizedError());
		}

		const accessToken = authorizationHeader.split(" ")[1];
		if (!accessToken) {
			return next(ApiError.UnauthorizedError());
		}

		const userData = TokenService.validateAccessToken(accessToken);
		if (!userData) {
			return next(ApiError.UnauthorizedError());
		}
		req;
		req.user = userData;
		next();
	} catch (e) {
		return next(ApiError.UnauthorizedError());
	}
}
