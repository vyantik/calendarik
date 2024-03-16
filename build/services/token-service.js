import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';
class TokenService {
    static async generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }
    static validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS);
            return userData;
        }
        catch (e) {
            return null;
        }
    }
    static validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH);
            return userData;
        }
        catch (e) {
            return null;
        }
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
            return token;
        }
    }
    static async removeToken(refreshToken) {
        const tokenData = await Token.findOne({ where: {
                refresh_token: refreshToken
            } });
        await (tokenData === null || tokenData === void 0 ? void 0 : tokenData.destroy());
        return tokenData;
    }
    static async findToken(refreshToken) {
        const tokenData = await Token.findOne({ where: {
                refresh_token: refreshToken
            } });
        return tokenData;
    }
}
export default TokenService;
//# sourceMappingURL=token-service.js.map