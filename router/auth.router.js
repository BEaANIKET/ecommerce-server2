
import { Router } from "express";

import { getCurrUser, login, logout, register,authUsingGoogle } from "../controllers/auth.controllers.js";
import passPort from "../config/passport.js";
import { isAuth } from "../middleware/index.js";

const router = new Router()

router.get('/get', async (req, res) => {
    return res.json({
        message: 'Hello, World!'
    }).status(200)
})
router.post('/register', register)
router.post('/login', login)
router.get('/google', passPort.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/redirect', passPort.authenticate('google', { session: false }), authUsingGoogle )
router.post('/logout', isAuth, logout)
router.post('/getCurruser', isAuth, getCurrUser)


export default router