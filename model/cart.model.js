import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true },
        },
    ],
    totalPrice: { type: String, required: true },
    // isOrderPlaced: { type: Boolean, default: false },
})

export const Cart = mongoose.model("Cart", cartSchema)
