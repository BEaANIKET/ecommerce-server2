import jwt from 'jsonwebtoken'
import { User } from '../model/user.model.js'

export const isAuth = async (req, res, next) => {

    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.JWT_SALT);
        const user = await User.findOne({ email: decodedToken.email }).select("email firstName lastName role")
        console.log(user);

        req.user = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }
        console.log(req.user);

        next()
    } catch (error) {
        res.clearCookie('token');
        return res.status(500).json({
            message: error.message || 'server error',
        });
    }
};

export const isSeller = async (req, res, next) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Access denied. You must be a seller.' });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
}

export const isPandit = async (req, res) => {
    try {
        if (req.user.role !== 'pandit') {
            return res.status(403).json({ message: 'Access denied. You must be a pandit.' });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        const decodedToken = jwt.verify(token, process.env.JWT_SALT)

        const user = await User.findOne({ email: decodedToken.email }).select("email role ");

        if (!user || user.role !== 'admin') {
            return res.status(401).json(
                {
                    message: "Unauthorized",
                }
            )
        }

        req.user = user;
        next()

    } catch (error) {
        return res.status(500).json(
            {
                message: "Server Error",
                error: error?.message,
            }
        )
    }
}
