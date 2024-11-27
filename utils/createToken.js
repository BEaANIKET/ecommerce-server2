

import jwt from 'jsonwebtoken'

export const generateToken = async (res, data) => {

    const token = jwt.sign(data, process.env.JWT_SALT, { expiresIn: '30d' });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return token
}

export const generateToken2 = async (data) => {
    const token = jwt.sign(data, process.env.JWT_SALT, { expiresIn: '30d' });
    return token;
}