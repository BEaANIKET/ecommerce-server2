import express from "express";
import {
    deleteBanner,
    getAllPandit,
    getAllSeller,
    getBannerUrl,
    getSpecificPandit,
    getSpecificSeller,
    postBanner
} from "../controllers/owner.controllers.js";
import { isAuth } from "../middleware/index.js";
import upload from "../middleware/multer/index.js";

const router = express.Router();

//get requests
router.get("/getAllSeller", isAuth, getAllSeller);
router.get("/getAllPandit", isAuth, getAllPandit);
router.get("/getSeller/:id", isAuth, getSpecificSeller);
router.get("/getPandit/:id", isAuth, getSpecificPandit);
router.get("/getBanner", getBannerUrl);

//post requests
router.post("/postBanner", isAuth, upload.single("banner"), postBanner);

//delete request
router.delete("/deleteBanner", deleteBanner)

export default router;