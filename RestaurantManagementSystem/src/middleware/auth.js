import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/errorHandler.js';
import userModel from '../../DB/models/User.model.js';

export const roles = {
    Admin: 'Admin',
    User: 'User',
};

const auth = (role = Object.values(roles)) => {
    return asyncHandler(async (req, res, next) => {
        const { authorization } = req.headers;

        if (!authorization) {
            return next(new Error('Please login', { cause: 401 }));
        }

        if (!authorization?.startsWith(`${process.env.BEARER_KEY}`)) {
            return next(new Error('Invalid bearer key', { cause: 400 }));
        }

        const token = authorization.split(`${process.env.BEARER_KEY}`)[1];

        if (!token) {
            return next(new Error('Invalid token', { cause: 400 }));
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.TOKEN_SIGNATURE);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new Error('Token expired', { cause: 401 }));
            }
            return next(new Error('Invalid token', { cause: 400 }));
        }

        if (!payload?.id) {
            return next(new Error('Invalid payload', { cause: 400 }));
        }

        const authUser = await userModel
            .findById(payload.id)
            .select('userName email role status');

        if (!authUser) {
            return next(new Error('The user doesn\'t exist', { cause: 404 }));
        }

        if (authUser.status !== 'Online') {
            return next(new Error('Invalid token, please login', { cause: 400 }));
        }

        if (!role.includes(authUser.role)) {
            return next(new Error('Not authorized', { cause: 403 }));
        }

        req.user = authUser;
        next();
    });
};

export default auth;
