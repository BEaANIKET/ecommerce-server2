import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: false,
    },
    image: [
        {
            type: String,
            required: true,
        }
    ],
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Category",
        type: String,
        required: true,
    },
    descriptions: {
        type: String,
        // required: true,
    },
    stock: {
        type: Number,
        // required: true,
    }
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema);