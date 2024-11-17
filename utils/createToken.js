

import jwt from 'jsonwebtoken'

export const generateToken = async (data) => {

    const token = jwt.sign(data, process.env.JWT_SALT, { expiresIn: '1h' })

    return token
}