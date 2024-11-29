import { User } from "../model/user.model.js";
import { Pandit } from "../model/pandit.model.js";
import { Seller } from "../model/seller.model.js";
import { PanditRequest } from "../model/panditRequest.model.js";
import { SellerRequest } from "../model/sellerRequest.model.js";
import { generateToken } from "../utils/createToken.js";


export const requestPanditRequest = async (req, res) => {
    try {
        const { requestedRole, contact, expertise, experience, imageUrl, age } = req.body;

        if (!requestedRole || !contact || !expertise || !experience || !imageUrl) {
            return res.status(400).json({ message: "All fields are required." });
        }
        if (!req.user) {
            return res.status(401).json({ message: "No user authenticated." });
        }

        const sellerRequest = await SellerRequest.findOne({ userId: req.user.id });
        if (sellerRequest) {
            return res.status(401).json({
                message: "You already for a seller"
            })
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.role !== 'user') {
            return res.status(403).json({ message: "Only users with role 'user' can request a pandit." });
        }
        const exiestedUser = await PanditRequest.findOne({ userId: req.user.id })
        if (exiestedUser) {
            return res.status(403).json({ message: "You have already requested a pandit." });
        }

        const newPanditRequest = await PanditRequest.create({
            contact,
            expertise,
            experience,
            imageUrl,
            userId: user._id,
            age
        });

        if (!newPanditRequest) {
            return res.status(500).json({ message: "Failed to create pandit profile." });
        }

        return res.status(200).json({
            message: "Role change request submitted successfully.",
            roleChangeRequest: newPanditRequest,
        });
    } catch (error) {
        console.error("Error in requestPanditRequest:", error.message);
        return res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
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
        const { shopName, shopAddress, shopImage, shopDocument, shopContactNo } = req.body;

        if (!shopName || !shopAddress || !shopImage || !shopDocument || !shopContactNo) {
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
            userId: user._id, shopName, shopAddress, shopImage, shopDocument, shopContactNo
        });

        if (!newSellerRequest) {
            return res.status(500).json({ message: "Failed to create Seller request." });
        }


        return res.status(200).json({
            message: "Role change request submitted successfully.",
            roleChangeRequest: newSellerRequest,
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
        const { shopName, shopAddress, shopimage, shopDocument, shopContactNo } = sellerRequest;

        const newSeller = await Seller.create({
            shopName, shopAddress, shopimage, shopDocument, shopContactNo, userId
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

        const allPanditRequests = await PanditRequest.find();
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
            select: 'name email role',
        });

        if (!allSellerRequest) {
            return res.status(401).json({ message: "no any pandit request." });
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
        const { roleType } = req.query

        if (!roleType) {
            return res.status(400).json({
                message: "Role type is required."
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