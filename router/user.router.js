import { Router } from "express";
import { allUser, updateProfile } from "../controllers/user.controllers.js";
import { isAuth } from "../middleware/index.js";

const router = Router()

router.patch('/updateProfile', isAuth, updateProfile)
router.get('/allUser', isAuth, allUser)

export default router

