import mongoose from "mongoose";

const panditSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expertise: { type: String, required: true },
    experience: { type: Number, required: true },
    availability: { type: String },
}, { timestamps: true });

export const Pandit = mongoose.model("Pandit", panditSchema);
