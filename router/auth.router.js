
import { Router } from "express";

import { getCurrUser, login, logout, register, authUsingGoogle, verifyUser } from "../controllers/auth.controllers.js";
import passPort from "../config/passport.js";
import { isAuth } from "../middleware/index.js";

const router = new Router()

router.get('/get', (req, res) => {
    res.json({ message: 'Hello from auth router' })
})
router.post('/register', register)
router.post('/login', login)
router.get('/getCurruser', isAuth, getCurrUser)
router.post('/verify', verifyUser)
router.get('/google', passPort.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/redirect', passPort.authenticate('google', { session: false }), authUsingGoogle)
router.post('/logout', isAuth, logout)


export default router