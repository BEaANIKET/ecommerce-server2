import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  bannerUrl: {
    type: String,
    required: true,
    trim: true, 
  },
});



export const Banner = mongoose.model('Banner', bannerSchema);