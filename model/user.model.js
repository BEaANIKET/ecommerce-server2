import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fname: { type: String},
    lname: { type: String },
    email: { type: String unique: true },
    password: { type: String, required: true },
    googleId: {
        type: String,
    },
    roleChangeRequest: {
        requestedRole: { type: String, enum: ["pandit", "seller"], default: null },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        requestedAt: { type: Date },
    },
}, { timestamps: true });


userSchema.methods.validatePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const User = mongoose.model('User', userSchema);
