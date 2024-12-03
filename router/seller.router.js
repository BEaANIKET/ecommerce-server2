import { Router } from "express";
import { isAuth, isSeller } from "../middleware/index.js";
import { getSellerInfo } from "../controllers/seller.controllers.js";

const router= Router();

// isSeller
router.get("/sellerInfo/:id", getSellerInfo);

export default router;