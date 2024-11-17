import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        // required: true,
    },
    lname: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        // required: true,
        unique: true,
    },
    password: {
        type: String,
        // required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    contactNo: {
        type: String,
    },
    Dob: {
        type: Date
    },
    googleId: {
        type: String,
    }

});

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
