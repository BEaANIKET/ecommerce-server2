
import { Router } from "express";
import { createOrder, getAllOrders, getOrderById } from "../controllers/order.controllers.js";
import { isAuth } from '../middleware/index.js'

const router = Router()

router.post("/createOrder", isAuth, createOrder);

router.get("/getOrderById", isAuth, getOrderById);

router.get("/getAllOrder", isAuth, getAllOrders);

export default router