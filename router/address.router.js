import { Router } from "express";
import { addAddress, deleteAddress, getAddresses, setDefault, updateAddress } from "../controllers/address.controllers.js";
import { isAuth } from "../middleware/index.js";

const router = Router();

router.post('/addAddress', isAuth, addAddress);
router.get('/getAddress', isAuth, getAddresses);
router.patch('/updateAddress', isAuth, updateAddress);
router.patch('/deleteAddress', isAuth, deleteAddress);
router.patch('/setDefault', isAuth, setDefault);

export default router