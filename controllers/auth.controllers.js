
// import mongoose from "mongoose";
import { User } from "../model/user.model.js";
// import jwt from 'jsonwebtoken'
import { generateToken } from "../utils/createToken.js";

export const register = async (req, res) => {
    try {

        const { fname, lname, email, password } = req.body;
        console.log(fname, lname, email, password);


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }


        const newUser = new User({
            fname,
            lname,
            email,
            password,
            role: 'owner'
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({
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
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await existedUser.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = await generateToken({ email: existedUser.email, id: existedUser.id })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful", token: {
                token: token
            }
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
        const user = await User.findOne({ email: req.user.email }).select("email role");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message || error,
        });
    }
}


export const authUsingGoogle= (req, res) => {
    try{

        const { user, token } = req.authInfo;

        console.log(user, token);
        
        return res.status(200).json({
            sucess: true, 
            token, 
            user
        });

    } catch(error) {

        return res.status(500).json({
            message: "Server Error",
            error: error.message || error
        });
    }

}

