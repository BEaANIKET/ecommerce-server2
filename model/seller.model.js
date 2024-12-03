import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shopName: { type: String, required: true },
    shopAddress: { type: String, required: true },
    shopimage: { type: String },
    AadhaarNum: { type: String },
    shopContactNo: { type: String }
}, { timestamps: true });

export const Seller = mongoose.model("Seller", sellerSchema);
