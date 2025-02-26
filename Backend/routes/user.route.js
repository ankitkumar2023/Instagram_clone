import express from "express";
import { editLoggedInUserProfile, followOrUnfollow, getSuggestedUser, getUserProfile, userLoginVerification, userLogout, userRegisteration } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(userRegisteration);
router.route('/login').post(userLoginVerification);
router.route('/logout').get(userLogout);
router.route('/:id/profile').get(isAuthenticated, getUserProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editLoggedInUserProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUser);
router.route('/followorunfollow/:id').post(isAuthenticated,followOrUnfollow)


export default router