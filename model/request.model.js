
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    state: {
        type: String,
        required: true,
    },
    // data: {
    //     type: 
    // }
});

export const UserRequest = mongoose.model('UserRequest', requestSchema);