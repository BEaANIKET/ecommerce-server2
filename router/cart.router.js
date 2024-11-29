import { Router } from "express";
import { addToCart, clearCart, getMyCart, removeFromCart, updateCartProductQuantity } from "../controllers/cart.controllers.js";
import { isAuth } from "../middleware/index.js";

const router = Router()

router.post('/addToCart', isAuth, addToCart)
router.post('/getMyCart', isAuth, getMyCart)
router.post('/updateCartQuantity', isAuth, updateCartProductQuantity)
router.post('/deleteCart', isAuth, removeFromCart)
router.post('/clearCart', isAuth, clearCart)

export default router