import { User } from "../model/user.model.js";
import { Pandit } from "../model/pandit.model.js";
import { Seller } from "../model/seller.model.js";


export const requestRoleChange = async (req, res) => {
    try {
        const { requestedRole } = req.body; // "pandit" or "seller"
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "user") {
            return res.status(400).json({ message: "Role change not allowed for your current role." });
        }

        user.roleChangeRequest = {
            requestedRole,
            status: "pending",
            requestedAt: new Date(),
        };
        await user.save();

        res.status(200).json({ message: "Role change request submitted." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const approveRoleChange = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isApproved, additionalData } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.roleChangeRequest.status !== "pending") {
            return res.status(400).json({ message: "No pending role change request." });
        }

        if (!isApproved) {
            user.roleChangeRequest.status = "rejected";
            await user.save();
            return res.status(200).json({ message: "Role change request rejected." });
        }

        user.role = user.roleChangeRequest.requestedRole;
        user.roleChangeRequest.status = "approved";
        await user.save();

        if (user.role === "pandit") {
            const pandit = new Pandit({ userId: user._id, ...additionalData });
            await pandit.save();
        } else if (user.role === "seller") {
            const seller = new Seller({ userId: user._id, ...additionalData });
            await seller.save();
        }

        res.status(200).json({ message: "Role change approved." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getPendingRoleChangeRequests = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Access denied. Only owners can view pending requests." });
        }

        const pendingUsers = await User.find({
            "roleChangeRequest.status": "pending"
        }).select("fname lname email roleChangeRequest");

        if (pendingUsers.length === 0) {
            return res.status(200).json({ message: "No pending role change requests found." });
        }

        res.status(200).json({
            message: "Pending role change requests retrieved successfully.",
            data: pendingUsers,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message || error,
        });
    }
};
