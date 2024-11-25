import mongoose from "mongoose";

const sellerRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shopName: { type: String, required: true },
    shopAddress: { type: String, required: true },
    shopimage: { type: String },
    shopDocument: { type: String },
    shopContactNo: { type: String }
})

export const SellerRequest = mongoose.model('SellerRequest', sellerRequestSchema);