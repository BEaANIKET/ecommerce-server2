import { User } from "../model/user.model.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error occurred while fetching profile",
        })
    }
}

export const updateProfile = async (req, res) => {
    try {

        const data = req.body
        console.log(data);
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await User.findByIdAndUpdate(req.user.id, {
            ...data
        }, { new: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error occurred while updating profile",
        })
    }
}


