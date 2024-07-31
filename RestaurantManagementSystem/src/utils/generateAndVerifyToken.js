import jwt from 'jsonwebtoken'
export const generateToken = ({ payload = {}, signature = process.env.TOKEN_SIGNATURE, expiresIn = '1h' } = {}) => {
    const token = jwt.sign(payload, signature, { expiresIn });
    return token;
};


export const verifyToken = ({ token, signature } = {}) => {
    try {
        const decoded = jwt.verify(token, signature);
        return decoded;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new Error('Token expired');
        }
        throw err;
    }
};
