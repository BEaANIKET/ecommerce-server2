
import { UnverifiedUser } from "../model/unVerifyedUser.model.js";
import { User } from "../model/user.model.js";
import { generateToken } from "../utils/createToken.js";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../utils/verificationsLink.js";

const generateRandomToken = (length = 32) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};

export const register = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered. Please log in.",
            });
        }

        const unverifiedUser = await UnverifiedUser.findOne({ email });
        if (unverifiedUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered but not verified. Please verify your email.",
            });
        }

        const verificationToken = generateRandomToken();

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUnverifiedUser = new UnverifiedUser({
            email,
            name,
            password: hashedPassword,
            verificationToken,
        });
        await newUnverifiedUser.save();

        const verificationLink = `${process.env.BASE_URI}/verify/${verificationToken}`;

        sendVerificationEmail(email, verificationLink);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
        });
    } catch (error) {
        console.error("Error during registration:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to register. Please try again later.",
            error: error.message,
        });
    }
};

export const verifyUser = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Token is required for verification",
        });
    }

    try {
        const unverifiedUser = await UnverifiedUser.findOne({ verificationToken: token });

        if (!unverifiedUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        const { email, name, password } = unverifiedUser;

        await User.create({ email, name, password });

        await UnverifiedUser.deleteOne({ verificationToken: token });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully!",
        });
    } catch (error) {
        console.error("Error verifying user:", error);

        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existedUser = await User.findOne({ email });
        if (!existedUser) {
            return res.status(401).json({ message: "user not exist" });
        }

        const isPasswordValid = await existedUser.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = await generateToken(res, { name: existedUser.name, email: existedUser.email, id: existedUser._id, role: existedUser.role })


        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=3600*7; Path=/`);
        res.status(200).json({
            message: "Login successful",
            user: {
                name: existedUser.name,
                email: existedUser.email,
                role: existedUser.role,
            },
            token: token

        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message || error,
        });
    }
};

export const logout = async (req, res) => {
    try {
        if (!req.cookies?.token) {
            return res.status(400).json({ message: "No token provided" });
        }

        res.clearCookie("token");

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message || error,
        });
    }
};

export const getCurrUser = async (req, res) => {

    try {
        if (!req.user) {
            return res.status(401).json({
                message: "No user authenticated."
            })
        }

        return res.status(200).json({
            user: req.user,
            message: "User data retrieved successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error ",
        })
    }
};

export const authUsingGoogle = (req, res) => {
    try {

        const { user, token } = req?.user;
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60
        });

        const redirectUri = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${redirectUri}/redirecting?token=${token}`);

    } catch (error) {

        return res.status(500).json({
            message: "Server Error",
            error: error.message || error
        });
    }

}

