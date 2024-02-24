import { v4 } from 'uuid';
import MailService from "../services/mail-service.js";
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
        await MailService.sendActivationMail(req.body.email, activation_link);
        return { ...tokens, user: userDto };
    }
}
export default UserService;
//# sourceMappingURL=user-service.js.map