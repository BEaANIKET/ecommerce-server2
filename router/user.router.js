import { Router } from "express";
import { updateProfile } from "../controllers/user.controllers.js";
import { isAuth } from "../middleware/index.js";

const router = Router()

router.post('/updateProfile', isAuth, updateProfile)

export default router

