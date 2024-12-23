// models/Order.js

import mongoose from "mongoose";

    //         productId: item.products._id,
    //         productSku: item.products.productSku,
    //         quantity: item.quantity,
    //         discountPrice: item.products.discountPrice,
    //         name: item.products.name,
    //         image: item.products.images,
    //         totalPrice: item.products.discountPrice * item.quantity,
    //         category: item.products.category,
    //         taxPercentage: item.products.taxPercentage


const orderSchema = new mongoose.Schema(
    {

        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                discountPrice: {
                    type: Number,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                totalPrice: {
                    type: Number,
                    required: true,
                },
                category: {
                    type: String,
                    required: true,
                },
                taxPercentage: {
                    type: Number,
                    required: true,
                },
                image: {
                    type: String,
                    required: true
                },
                productSku: {
                    type: String,
                    required: true
                }
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        selectedAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            contactNo: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            enum: ["online", "cod"],
            required: true,
        },
        paymentId: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["pending", "delivered", "cancelled"],
            default: "pending",
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

