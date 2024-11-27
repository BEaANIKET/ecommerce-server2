import { Router } from "express";
import { updateProfile } from "../controllers/user.controllers.js";
import { isAuth } from "../middleware/index.js";

const router = Router()

router.patch('/updateProfile', isAuth, updateProfile)

export default router

