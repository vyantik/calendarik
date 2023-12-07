import jwt from 'jsonwebtoken';
export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.body.userId = decoded.id;
            next();
        }
        catch (e) {
            res.status(403).json({
                message: 'Нет доступа',
            });
            return;
        }
    }
    else {
        res.status(403).json({
            message: 'Нет доступа',
        });
        return;
    }
};
//# sourceMappingURL=checkAuth.js.map