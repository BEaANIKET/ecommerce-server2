import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shop_name: { type: String, required: true },
    shop_address: { type: String, required: true },
    imageUrl: { type: String },
    pin_code: { type: String, required: true},
    AadhaarNum: { type: String },
    shop_contact: { type: String }
}, { timestamps: true });

export const Seller = mongoose.model("Seller", sellerSchema);
