
import { User } from "../model/user.model.js";
import { generateToken } from "../utils/createToken.js";
import bcrypt from "bcrypt";


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user with the hashed password
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate a token
        const token = generateToken(newUser._id);
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message || error,
        });
    }
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);


        const existedUser = await User.findOne({ email });
        if (!existedUser) {
            return res.status(401).json({ message: "user not exist" });
        }

        const isPasswordValid = await existedUser.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = await generateToken({ email: existedUser.email, id: existedUser._id, role: existedUser.role })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


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
        const user = await User.findOne({ email: req.user.email }).select("email role name");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message || error,
        });
    }
}


export const authUsingGoogle = (req, res) => {
    try {

        const { user, token } = req?.user;
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60
        });

        const redirectUri = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(`${redirectUri}/redirect?token=${token}`);

    } catch (error) {

        return res.status(500).json({
            message: "Server Error",
            error: error.message || error
        });
    }

}

