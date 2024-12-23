// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     discountPrice: {
//         type: Number,
//         required: false,
//     },
//     image: [
//         {
//             type: String,
//             required: true,
//         }
//     ],
//     category: {
//         // type: mongoose.Schema.Types.ObjectId,
//         // ref: "Category",
//         type: String,
//         required: true,
//     },
//     descriptions: {
//         type: String,
//         // required: true,
//     },
//     stock: {
//         type: Number,
//         // required: true,
//     }
// }, { timestamps: true })

// export const Product = mongoose.model("Product", productSchema);


import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
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
        images: [
            {
                type: String,
                required: true,
            },
        ],
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        metaDescription: {
            type: String,
            required: true,
        },
        metaTitle: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        productSku: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        taxPercentage: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);