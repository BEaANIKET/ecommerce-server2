import mongoose from "mongoose";

const sellerRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
    shop_name: { type: String, required: true },
    shop_address: { type: String, required: true },
    pin_code: { type: String, required: true},
    imageUrl: { type: String },
    AadhaarNum: { type: String },
    shop_contact: { type: String, required: true },
    appliedRole: {
        type: String, 
        default:"seller",
    }
})

export const SellerRequest = mongoose.model('SellerRequest', sellerRequestSchema);
    