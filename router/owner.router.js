import express from "express";
import {
    deleteBanner,
    deleteCategory,
    getAllPandit,
    getAllSeller,
    getBannerUrl,
    getCategory,
    getSpecificPandit,
    getSpecificSeller,
    postBanner,
    postCategory
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
router.get("/getCategories", getCategory);

//post requests
router.post("/postBanner", isAuth, upload.single("banner"), postBanner);
router.post("/postCategory", isAuth, postCategory);

//delete request
router.delete("/deleteBanner", deleteBanner)
router.delete("/deleteCategory", deleteCategory)

export default router;