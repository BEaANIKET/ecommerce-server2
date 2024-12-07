
import mongoose from "mongoose";

const panditRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expertise: { type: String, required: true },
    experience: { type: String, required: true },
    availability: { type: Boolean, default: true },
    contact: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    age: {
        type: String,
    },
    aadharNo: {
        type: String,
        required: true,
    },
    appliedRole: {
        type: String, 
        default:"pandit",
    }

}, { timestamps: true });

export const PanditRequest = mongoose.model("PanditRequest", panditRequestSchema);
