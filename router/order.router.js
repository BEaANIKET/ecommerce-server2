
import { Router } from "express";
import { createOrder, getAllOrders, getOrderByUserid } from "../controllers/order.controllers.js";
import { isAuth } from '../middleware/index.js'

const router = Router()

router.post("/createOrder", isAuth, createOrder);

router.get("/getOrderByUserid", isAuth, getOrderByUserid);

router.get("/getAllOrder", isAuth, getAllOrders);

export default router