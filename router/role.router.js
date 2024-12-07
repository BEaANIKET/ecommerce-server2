import express from "express";
import { isAuth } from "../middleware/index.js";
import { approvePanditRequest, approveSellerRequest, cancelMyRequest, getAllVerifiedUsers, getMyRequestStatus, getPanditData, getPendingPanditRequests, getPendingSellerRequests, getSellerData, rejectPanditRequest, rejectSellerRequest, rejectVerification, requestPanditRequest, requestSellerRequest } from "../controllers/role.controllers.js";
import upload from "../middleware/multer/index.js";

const router = express.Router();

// pandit role router 
router.post("/requestPandit", isAuth, upload.single("file"), requestPanditRequest);



//  seller role router 
router.post('/requestSellerRequest', isAuth, requestSellerRequest)//done

// owner role router
router.get('/getMyRequestStatus', isAuth, getMyRequestStatus)
router.post('/cenceleRequestStatus', isAuth, cancelMyRequest)

// owner role router
router.get('/getPendingPanditRequest', isAuth, getPendingPanditRequests)//done
router.get('/getPendingSellerRequest', isAuth, getPendingSellerRequests)//done

router.patch('/rejectPanditRequest', isAuth, rejectPanditRequest)
router.patch('/approvedPanditRequest', isAuth, approvePanditRequest);

//cancel seller account
router.post('/rejectVerification', isAuth, rejectVerification)
// router.post('/getAllVerified', isAuth, getAllVerifiedUsers)
router.patch('/approvedSellerRequest', isAuth, approveSellerRequest)
router.patch('/rejectSellerRequest', isAuth, rejectSellerRequest)

router.get('/sellerDetails', isAuth, getSellerData)
router.get('/panditDetails', isAuth, getPanditData)

export default router;