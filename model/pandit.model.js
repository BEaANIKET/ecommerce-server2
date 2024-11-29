import mongoose from "mongoose";

const panditSchema = new mongoose.Schema({
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
        // required: true,
    },
    aadharNo: {
        type: String,
        // required: true,
    },
    balance: {
        type: Number,
        // required: true,
    }

}, { timestamps: true });

export const Pandit = mongoose.model("Pandit", panditSchema);
