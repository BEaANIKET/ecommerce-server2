import { User } from "../model/user.model.js";
import { Pandit } from "../model/pandit.model.js";
import { Seller } from "../model/seller.model.js";
import { PanditRequest } from "../model/panditRequest.model.js";
import { SellerRequest } from "../model/sellerRequest.model.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs";
import { checkIfPresent } from "../utils/checkIfPresent.js";
import { getRoleData } from "../utils/getRoleData.js";


export const requestPanditRequest = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Profile image is required!" });
        }

        const { expertise, experience, contact, age, aadharNo } = req.body;

        if (!expertise || !experience || !contact || !age || !aadharNo) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (req.user.role !== 'user') {
            fs.unlinkSync(file.path);

            return res.status(403).json({ message: "You cant apply for a pandit" });
        }
        const pandit = await PanditRequest.find({ userId: req.user.id })
        console.log("pandit", pandit);

        if (pandit.length) {
            fs.unlinkSync(file.path);
            return res.status(400).json({ message: "You have already requested for pandit services." });
        }

        const uploadedImage = await cloudinary.uploader.upload(file.path, {
            folder: "pandit_profiles",
        });
        const newPandit = new PanditRequest({
            userId: req.user.id,
            expertise,
            experience,
            contact,
            age,
            aadharNo,
            imageUrl: uploadedImage.secure_url,
        });

        await newPandit.save()
        fs.unlinkSync(file.path);
        console.log("Saved Pandit:", newPandit);

        res.status(201).json({
            message: "Pandit registered successfully!",
            pandit: newPandit,
        });
    } catch (error) {
        fs.unlinkSync(file.path);
        console.error(error);
        res.status(500).json({ message: "An error occurred while registering the pandit.", error: error });
    }

};

export const approvePanditRequest = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const panditRequest = await PanditRequest.findOne({ userId: userId });
        if (!panditRequest) {
            return res.status(404).json({ message: "Pandit request not found." });
        }

        const newPandit = await Pandit.create({
            userId: panditRequest.userId,
            expertise: panditRequest.expertise,
            experience: panditRequest.experience,
            availability: panditRequest.availability,
            contact: panditRequest.contact,
            imageUrl: panditRequest.imageUrl,
            age: panditRequest.age,
        });

        if (!newPandit) {
            return res.status(500).json({ message: "Failed to create pandit profile." });
        }

        await PanditRequest.deleteOne({ userId: panditRequest.userId });

        user.role = 'pandit';
        await user.save();

        return res.status(200).json({
            message: "Pandit request approved and profile created successfully.",
            panditProfile: newPandit,
            token
        });
    } catch (error) {
        console.error("Error in approvePanditRequest:", error.message);
        return res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

export const rejectPanditRequest = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const panditRequest = await PanditRequest.findOne({ userId: userId });
        if (!panditRequest) {
            return res.status(404).json({ message: "Pandit request not found." });
        }

        await PanditRequest.deleteOne({ userId: panditRequest.userId });

        user.role = 'user';
        await user.save();

        return res.status(200).json({
            message: "Pandit request reject successfully.",
        });
    } catch (error) {
        console.error("Error in rejectPanditRequest:", error.message);
        return res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

export const requestSellerRequest = async (req, res) => {
    try {
        const { shop_name, shop_address, imageUrl, pin_code, shop_contact,AadhaarNum } = req.body;

        if (!shop_name || !shop_address || !imageUrl || !pin_code || !shop_contact || !AadhaarNum) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const panditRequest = await PanditRequest.find({ userId: req.user.id });
        if (panditRequest.length !== 0) {
            return res.status(400).json({
                message: "you already applied for a pandit ."
            })
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.role !== 'user') {
            return res.status(403).json({ message: "Only users can request a seller." });
        }

        const exiestedReq = await SellerRequest.findOne({ userId: user._id })
        console.log(exiestedReq);

        if (exiestedReq) {
            return res.status(400).json({ message: "You have already requested for a seller role." });
        }

        const newSellerRequest = await SellerRequest.create({
            userId: user._id, shop_name, shop_address, imageUrl, shop_contact, pin_code, AadhaarNum
        });
 

        if (!newSellerRequest) {
            return res.status(500).json({ message: "Failed to create Seller request." });
        }

        return res.status(200).json({
            message: "Role change request submitted successfully.",
            // roleChangeRequest: newSellerRequest,
        });
    } catch (error) {
        console.error("Error in requestSellerRequest:", error.message);
        return res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

export const approveSellerRequest = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const sellerRequest = await SellerRequest.findOne({ userId: userId });
        if (!sellerRequest) {
            return res.status(404).json({ message: "Seller request not found." });
        }
        const { shop_name, shop_address, imageUrl, pin_code, shop_contact, AadhaarNum } = sellerRequest;

        const newSeller = await Seller.create({
            shop_name, shop_address, imageUrl, pin_code, shop_contact, AadhaarNum, userId
        });

        if (!newSeller) {
            return res.status(500).json({ message: "Failed to create pandit profile." });
        }

        await SellerRequest.deleteOne({ userId: newSeller.userId });

        user.role = 'seller';
        await user.save();

        return res.status(200).json({
            message: "seller request approved and profile created successfully.",
            SellerRequest: newSeller,
        });
    } catch (error) {
        console.error("Error in approvePanditRequest:", error.message);
        return res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

export const rejectSellerRequest = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const sellerRequest = await SellerRequest.findOne({ userId: userId });
        if (!sellerRequest) {
            return res.status(404).json({ message: "Seller request not found." });
        }

        await SellerRequest.deleteOne({ userId: sellerRequest.userId });

        user.role = 'user';
        await user.save();

        return res.status(200).json({
            message: "Seller request Reject and profile created successfully.",
        });
    } catch (error) {
        console.error("Error in rejectSellerRequest:", error.message);
        return res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
};

export const getPendingPanditRequests = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const allPanditRequests = await PanditRequest.find().populate({
            path: 'userId',
            select: 'firstName lastName email role',
        });
        
        if (!allPanditRequests) {
            return res.status(404).json({ message: "No pending requests found." });
        }

        return res.status(200).json({
            message: "Pending pandit requests fetched successfully.",
            data: allPanditRequests,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message || error,
        });
    }
};

export const getPendingSellerRequests = async (req, res) => {

    try {

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const allSellerRequest = await SellerRequest.find().populate({
            path: 'userId',
            select: 'firstName lastName email role',
        });

        if (!allSellerRequest) {
            return res.status(204);
        }

        return res.status(200).json({
            message: "pending seller requests fetched successfully.",
            data: allSellerRequest,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message || error,
        })
    }

}

export const getMyRequestStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const requestType = req.query.requestType;

        if (!requestType) {
            return res.status(400).json({
                message: "Request type is required."
            });
        }

        if (requestType === 'pandit') {
            const status = await PanditRequest.findOne({ userId });
            if (!status) {
                return res.status(404).json({
                    message: "No pandit request found."
                });
            }
            return res.status(200).json({
                message: "Pandit request status fetched successfully.",
                data: status
            });
        }
        else if (requestType === 'seller') {
            const status = await SellerRequest.findOne({ userId });
            if (!status) {
                return res.status(404).json({
                    message: "No seller request found."
                });
            }
            return res.status(200).json({
                message: "Seller request status fetched successfully.",
                data: status
            });
        }
        return res.status(400).json({
            message: "Invalid request type. It should be either 'pandit' or'seller'."
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error occurred while fetching requests."
        });
    }
};

export const cancelMyRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const requestType = req.query.requestType;
        if (requestType === 'pandit') {
            await PanditRequest.findOneAndDelete({ userId });
        }
        else if (requestType === 'seller') {
            await SellerRequest.findOneAndDelete({ userId });
        }
        return res.status(200).json({
            message: "Request cancelled successfully."
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error occurred while cancelling request."
        })
    }
}

export const rejectVerification = async (req, res) => {
    try {
        const { userId } = req.query

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required."
            });
        }

        const user = await User.findByIdAndUpdate(userId, { role: 'user' }, { new: true });

        return res.status(200).json({
            message: "User rejected verification successfully.",
            user
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error occurred while rejecting verification."
        })
    }
}

export const getAllVerifiedUsers = async (req, res) => {
    try {
        const { id } = req.query

        if (!id) {
            return res.status(400).json({
                message: "ID is required."
            });
        }

        const users = await User.find({ role: roleType })

        return res.status(200).json({
            message: "Users fetched successfully.",
            users
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error occurred while fetching verified users."
        })
    }
}

export const getSellerData = async (req, res) => {

    const { id } = req.query;
    if (!checkIfPresent(id)) {
        return res.status(400).json({
            message: "ID is required."
        });
    }

    const data = await getRoleData(Seller, id)

    return data
}

export const getPanditData = async (req, res) => {

    const { id } = req.query;
    if (!checkIfPresent(id)) {
        return res.status(400).json({
            message: "ID is required."
        });
    }

    const data = await getRoleData(Pandit, id)

    return data;
}

export const payToPandit = async (req, res) => {
    try {
        const { userId, amount } = req.body

        if (!userId || !amount) {
            return res.status(400).json({
                message: "User ID and amount are required."
            });
        }

        const pandit = await Pandit.findByIdAndUpdate(userId, { balance: Pandit.balance + amount }, { new: true });

        if (!pandit) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            message: "Payment successful.",
            pandit
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error occurred while paying to pandit."
        })
    }
}