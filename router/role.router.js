import express from "express";
import { isAuth } from "../middleware/index.js";
import { getPendingRoleChangeRequests, requestRoleChange, approveRoleChange } from "../controllers/role.controllers.js";

const router = express.Router();

router.get("/pending", isAuth, getPendingRoleChangeRequests);

router.post("/request", isAuth, requestRoleChange);

router.post("/approve/:userId", isAuth, approveRoleChange);

export default router;
