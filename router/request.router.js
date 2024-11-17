

import { Router } from "express";
import { createRequest, updateRequest } from "../controllers/request.controllers.js";
import { isAdmin, isAuthorized } from "../middleware/index.js";


const router = Router();

router.post('/generateRequest', isAuthorized, createRequest);
router.post('/updateRequest', isAdmin, updateRequest)

export default router