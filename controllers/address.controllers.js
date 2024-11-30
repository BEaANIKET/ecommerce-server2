import { Address } from "../model/adddress.model.js";


export const addAddress = async (req, res) => {
    try {

        const { fullName, address, city, state, country, zipCode, contactNo } = req.body;
        console.log(fullName, address, country, zipCode, contactNo, state);

        if (!fullName || !address || !city || !state || !country || !zipCode || !contactNo) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newAddress = await Address.create({
            userId: req.user.id,
            fullName,
            address,
            city,
            state,
            country,
            zipCode,
            contactNo,
        });

        if (!newAddress) {
            return res.status(400).json({ message: "Failed to add address." });
        }

        return res.status(201).json({ message: "Address added successfully.", data: newAddress });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to add address." });
    }
}

export const getAddresses = async (req, res) => {
    try {
        console.log(req.user);

        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const addresses = await Address.find({ userId });

        if (!addresses) {
            return res.status(404).json({ message: "No addresses found." });
        }

        return res.status(200).json({ message: "Addresses fetched successfully.", data: addresses });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch addresses." });
    }
}

export const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, address, city, state, country, zipCode, contactNo } = req.body
        const { id } = req.query

        if (!userId || !id) {
            return res.status(400).json({ message: "User ID and id are required." });
        }

        const updatedAddress = await Address.findOneAndUpdate(
            { userId: userId, _id: id },
            {
                $set: {
                    fullName,
                    address,
                    city,
                    state,
                    country,
                    zipCode,
                    contactNo,
                }
            },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found." });
        }

        return res.status(200).json({
            message: "Address updated successfully.",
            address: updatedAddress
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to update address."
        })
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.query;

        if (!userId || !id) {
            return res.status(400).json({ message: "User ID and address ID are required." });
        }

        const deletedAddress = await Address.findOneAndDelete({ userId: userId, _id: id });

        if (!deletedAddress) {
            return res.status(404).json({ message: "Address not found." });
        }

        return res.status(200).json({
            message: "Address deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to delete address."
        })
    }
}

export const setDefault = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.query;

        if (!userId || !id) {
            return res.status(400).json({ message: "User ID and address ID are required." });
        }

        await Address.updateMany({ userId: userId }, { default: false });

        const updatedAddress = await Address.findOneAndUpdate(
            { userId: userId, _id: id },
            { $set: { default: true } },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found." });
        }

        return res.status(200).json({
            message: "Default address set successfully.",
            updatedAddress
        });
    } catch (error) {
        console.error("Error setting default address:", error);
        return res.status(500).json({
            message: error.message || "Failed to set default address."
        });
    }
};
