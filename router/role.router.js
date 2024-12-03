import express from "express";
import { isAuth } from "../middleware/index.js";
import { approvePanditRequest, approveSellerRequest, cancelMyRequest, getAllVerifiedUsers, getMyRequestStatus, getPanditData, getPendingPanditRequests, getPendingSellerRequests, getSellerData, rejectPanditRequest, rejectSellerRequest, rejectVerification, requestPanditRequest, requestSellerRequest } from "../controllers/role.controllers.js";
import upload from "../middleware/multer/index.js";

const router = express.Router();

// pandit role router 
router.post("/requestPandit", isAuth, upload.single("file"), requestPanditRequest);



//  seller role router 
router.post('/requestSellerRequest', isAuth, requestSellerRequest)

// owner role router
router.get('/getMyRequestStatus', isAuth, getMyRequestStatus)
router.post('/cenceleRequestStatus', isAuth, cancelMyRequest)


// owner role router
router.post('/getPendingPanditRequest', isAuth, getPendingPanditRequests)
router.post('/getPendingSellerRequest', isAuth, getPendingSellerRequests)
router.post('/rejectPanditRequest', isAuth, rejectPanditRequest)
router.post('/approvedPanditRequest', isAuth, approvePanditRequest);
router.post('/rejectVerification', isAuth, rejectVerification)
// router.post('/getAllVerified', isAuth, getAllVerifiedUsers)
router.post('/approvedSellerRequest', isAuth, approveSellerRequest)
router.post('/rejectSellerRequest', isAuth, rejectSellerRequest)

router.get('/sellerDetails', isAuth, getSellerData)
router.get('/panditDetails', isAuth, getPanditData)


export default router;
