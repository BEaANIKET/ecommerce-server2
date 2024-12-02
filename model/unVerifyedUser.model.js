import mongoose from 'mongoose';

const UnverifiedUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verificationToken: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 600, // 10 minutes in seconds
    },
});

export const UnverifiedUser = mongoose.model('UnverifiedUser', UnverifiedUserSchema);
