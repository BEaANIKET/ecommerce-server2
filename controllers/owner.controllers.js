import mongoose from "mongoose";
import { Pandit } from "../model/pandit.model.js";
import { Seller } from "../model/seller.model.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { Banner } from "../model/banner.model.js";
import fs from "fs";
import { Categories } from "../model/category.model.js";

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
        });

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

export const getSpecificSeller = async (req, res) => {

    const id = req.params.id
    try{

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({ message: "Provided id is not valid!" })
        }

        const seller= await Seller.findOne({
            _id: id
        }).populate({
            path: 'userId',
            select: 'firstName lastName email',
        })
    
        if(!seller){
            return res.status(404).json({ message: "No seller with the Provided id found" })
        }

        return res.status(200).json({
            message: "Seller with specific id fetched successfully",
            seller
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({
            message: error.message || "Server error occurred while fetching verified seller."
        })
    }
}

export const getSpecificPandit= async (req, res) => {
    const id= req.params.id
    try{

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({ message: "Provided id is not valid!" })
        }

        const pandit= await Pandit.findOne({
            _id: id
        }).populate({
            path: 'userId',
            select: 'firstName lastName email',
        })
    
        if(!pandit){
            return res.status(404).json({ message: "No pandit with the Provided id found" })
        }

        return res.status(200).json({
            message: "Pandit with specific id fetched successfully",
            pandit
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({
            message: error.message || "Server error occurred while fetching verified seller."
        })
    }
}



export const postBanner = async (req, res) => {
    try {
        const filePath = req.file;  // Use filePath variable here

        if (!filePath) {  // Check if filePath is missing
            return res.status(400).json({ message: "Image is required!" });
        }

        const { type }= req.body

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(filePath.path, {
            folder: 'banner'
        });

        // Create new banner entry in the database
        const newBanner = new Banner({ bannerUrl: result.secure_url, bannerType: type });

        await newBanner.save();
        fs.unlinkSync(filePath.path)

        // Respond with the URL of the uploaded banner image
        return res.status(200).json({newBanner});
    } catch (error) {
        console.error(error);
        fs.unlinkSync(filePath.path)
        return res.status(500).json({ message: "Failed to upload banner." });
    }
};

export const getBannerUrl= async (req, res) => {
    try{
        const banner= await Banner.find();

        if(!banner.length){
            return res.status(404).json({ message: "No banner has been uploaded yet. Please upload a banner image to proceed.",})
        }

        return res.status(200).json({ banner })
    }catch(error) {
        console.error(error);

        return res.status(500).json({  
            message: "An unexpected error occurred. Please contact support if the issue persists." 
        });
    }
}

export const deleteBanner= async (req, res) => {
    try{
        const id= req.query.id;
        if(!id) {
            return res.status(400).json({ 
                message: "The request URL must include a valid ID parameter.Ensure you have included the ID and try again."
            })
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({ message: "Provided id is not valid!" })
        }
        
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ 
                message: "No banner found with the provided ID." 
            });
        }

        await Banner.deleteOne({ _id: id });

        return res.status(200).json({
            message: "Banner deleted successfully.",
            bannerId: id
        });
        
    }catch(error) {

        console.error(error);
        return res.status(500).json({  
            message: "An unexpected error occurred. Please try again later." 
        });
    }
}

export const postCategory = async (req, res) => {
    try {
        // Destructure request body
        const { title, gradient, icon } = req.body;

        // Validate required fields
        if (!title || !gradient || !icon) {
            return res.status(400).json({
                message: "All fields are required. Please ensure 'title', 'gradient', and 'icon' are provided.",
            });
        }

        const existingCategory = await Categories.findOne({ title: title });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists.",
            });
        }
        
        const category = new Categories({
            title,
            gradient,
            icon,
        });

        // Save category to the database
        await category.save();

        // Return success response
        return res.status(201).json({
            message: "Category successfully created!",
            category,
        });

    } catch (error) {
        console.error("Error creating category:", error);

        return res.status(500).json({
            message: "An unexpected error occurred. Please try again later.",
        });
    }
};

export const getCategory= async(req, res) => {
    try{
        const category= await Categories.find();

        if(!category.length){
            return res.status(404).json({ 
                message: "No Category has been added yet. Please add a Category to proceed.",
            })
        }

        return res.status(200).json({ category })

    }catch(error){
        console.error("Error creating category:", error);

        return res.status(500).json({
            message: "An unexpected error occurred. Please try again later.",
        });
    }
}

export const deleteCategory = async(req, res) => {
    try{
        const { name }= req.query;

        if(!name) {
            return res.status(400).json({ 
                message: "The request URL must include a valid name parameter.Ensure you have included the name and try again."
            });
        }

        await Categories.deleteOne({
            title: name
        })

        return res.status(200).json({
            message: "Category deleted successfully.",
        });

    }catch(error) {
        console.log(error)

        return res.status(500).json({
            message: "An unexpected error occurred. Please try again later.",
        });
    }
}