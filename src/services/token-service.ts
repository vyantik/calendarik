import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';
import UserDto from '../utils/user-dto.js';

class TokenService {
    static async generateTokens(payload: UserDto) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, {expiresIn: '30d'});

        return {
            accessToken,
            refreshToken
        };
    }

    static validateAccessToken(token: string){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS);
            return userData;
        } catch(e) {
            return null;
        }
    }

    static validateRefreshToken(token: string){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH);
            return userData;
        } catch(e) {
            return null;
        }
    }

    static async saveToken(userId: number, refreshToken: string) {
        const tokenData = await Token.update(
			{
				refresh_token: refreshToken,
			},
			{
				where: { user_id: userId },
			},
		);

        if(tokenData[0] == 0){
            const token = await Token.create({
                user_id: userId,
                refresh_token: refreshToken, 
            });
            
            return token;
        }
    }

    static async removeToken(refreshToken: string) {
        const tokenData = await Token.findOne({where: {
            refresh_token: refreshToken
        }});

        await tokenData?.destroy();

        return tokenData;
    }

    static async findToken(refreshToken: string) {
        const tokenData = await Token.findOne({where: {
            refresh_token: refreshToken
        }});

        return tokenData;
    }
}

export default TokenService;