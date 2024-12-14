import mongoose, { Types } from "mongoose";

const CategorySchema = new mongoose.Schema({
    title: {
        type: String, // Fixed: Use "type" instead of "Types"
        required: true,
    },
    gradient: {
        type: String, // Fixed
        required: true,
    },
    icon: {
        type: String, // Fixed
        required: true,
    },
});

export const Categories= mongoose.model('Categories', CategorySchema);