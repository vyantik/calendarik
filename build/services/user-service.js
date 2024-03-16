import { v4 } from 'uuid';
import TokenService from "../services/token-service.js";
import UserDto from "../utils/user-dto.js";
import User from '../models/User.js';
import bcrypt from "bcrypt";
class UserService {
    static async registration(req) {
        const candidate = await User.findOne({ where: { email: req.body.email } });
        if (candidate) {
            throw new Error('Пользователь с этим email уже есть');
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const activation_link = v4();
        const user = await User.create({
            email: req.body.email,
            full_name: req.body.full_name,
            avatar_url: req.body.avatar_url,
            activation_link: activation_link,
            password_hash: hash
        });
        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }
    static async refresh(refreshToken) {
        if (!refreshToken) {
            throw Error('нет токена');
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await TokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw Error('нет токена2');
        }
        const user = await User.findOne({ where: { id: userData.id } });
        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }
    static async activate(activationLink) {
        const user = await User.findOne({ where: { activation_link: activationLink } });
        if (!user) {
            throw new Error('Некорректная ссылка активации');
        }
        await User.update({
            is_activated: true,
        }, {
            where: { id: user.id }
        });
    }
    static async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }
}
export default UserService;
//# sourceMappingURL=user-service.js.map