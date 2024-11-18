import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    googleId: {
        type: String,
    },
    role: {
        type: String,
        enum: ["owner", "user", "pandit", "seller"],
        default: "user",
    },
    roleChangeRequest: {
        requestedRole: { type: String, enum: ["pandit", "seller"], default: null },
        status: { type: String, enum: ["pending", "approved", "rejected", null], default: null },
        requestedAt: { type: Date },
    },
}, { timestamps: true });


userSchema.methods.validatePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



export const User = mongoose.model('User', userSchema);
