import { Router } from "express";
import { addProduct, deleteProduct, getFilterProduct, getProductDetails, getSearchProduct, updateProduct } from "../controllers/product.controllers.js";
import { isAuth } from "../middleware/index.js";

const router = Router()


router.post('/addproduct', isAuth, addProduct)
router.post('/updateproduct', isAuth, updateProduct)
router.delete('/deleteproduct', isAuth, deleteProduct)
router.post('/getFilterProduct', getFilterProduct)
router.post('/getSearchProduct', getSearchProduct)
router.get('/getProductDetails', getProductDetails)



export default router