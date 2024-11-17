import jwt from 'jsonwebtoken'
import { User } from '../model/user.model.js'

export const isAuthorized = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer", "")

        const decodedToken = jwt.verify(token, process.env.JWT_SALT)

        if (!decodedToken) {
            return res.status(401).json(
                {
                    message: "Unauthorized",
                }
            )
        }

        req.user = decodedToken;
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

export const isSeller = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        const decodedToken = jwt.verify(token, process.env.JWT_SALT)

        const user = await User.findOne({ email: decodedToken.email }).select("--password");

        if (!user || user.role !== 'seller') {
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

export const isPandit = async (req, res) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        const decodedToken = jwt.verify(token, process.env.JWT_SALT)

        const user = await User.findOne({ email: decodedToken.email });

        if (!user || user.role !== 'pandit') {
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

export const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        const decodedToken = jwt.verify(token, process.env.JWT_SALT)

        const user = await User.findOne({ email: decodedToken.email });

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