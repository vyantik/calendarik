import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';
class TokenService {
    static async generateTokens(payload) {
        const accessToken = jwt.sign(payload, 'jwt-access', { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, 'jwt-refresh', { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }
    static async saveToken(userId, refreshToken) {
        const tokenData = await Token.update({
            refresh_token: refreshToken,
        }, {
            where: { user_id: userId },
        });
        if (tokenData[0] == 0) {
            const token = await Token.create({
                user_id: userId,
                refresh_token: refreshToken,
            });
            console.log(token);
            return token;
        }
    }
}
export default TokenService;
//# sourceMappingURL=token-service.js.map