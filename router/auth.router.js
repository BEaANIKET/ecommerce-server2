
import { Router } from "express";
import { getCurrUser, login, logout, register } from "../controllers/auth.controllers.js";
import { isAuthorized } from "../middleware/index.js";

const router = new Router()

router.get('/get', async (req, res) => {
    return res.json({
        message: 'Hello, World!'
    }).status(200)
})
router.post('/register', register)
router.post('/login', login)
router.post('/logout', isAuthorized, logout)
router.post('/getCurruser', isAuthorized, getCurrUser)
// router.get('/google',)

export default router