import { Pandit } from "../model/pandit.model.js";
import { Seller } from "../model/seller.model.js";

export const getAllSeller = async (req, res) => {

    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const sellers = await Seller.find().populate({
            path: 'userId',
            select: 'firstName lastName email',
        });

        if (!sellers.length) {
            return res.status(404).json({ message: "No seller found" })
        }

        return res.status(200).json({
            message: "All seller data is successfully fetched",
            data: sellers
        })
    } catch (error) {
        console.error("Error fetching sellers:", error);
        return res.status(500).json({
            message: error.message || "Server error occurred while fetching verified users."
        })
    }
}

export const getAllPandit = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." })
        }

        const pandits = await Pandit.find().populate({
            path: 'userId',
            select: 'firstName lastName email',
        });;

        if (!pandits.length) {
            return res.status(404).json({ message: "No pandit found" })
        }

        return res.status(200).json({
            message: "All pandit data is successfully fetched",
            data: pandits
        })
    } catch (error) {
        console.error("Error fetching pandits:", error);
        return res.status(500).json({
            message: error.message || "Server error occurred while fetching verified users."
        })
    }
}