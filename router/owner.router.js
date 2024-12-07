import express from "express";
import { getAllPandit, getAllSeller } from "../controllers/owner.controllers.js";
import { isAuth } from "../middleware/index.js";

const router= express.Router();

router.get("/getAllSeller", isAuth, getAllSeller);
router.get("/getAllPandit", isAuth, getAllPandit);

export default router;