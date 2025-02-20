import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js"
import { addComment, addNewPost, BookmarkPost, deletePost, disLikePost, getAllPost, getCommentOfParticularPost, getUserPost, likePost } from "../controllers/post.controller.js";

const router = express();

router.route('/addpost').post(isAuthenticated, upload.single("image"), addNewPost);
router.route('/all').get(isAuthenticated, getAllPost);
router.route('/userpost/all').get(isAuthenticated, getUserPost);
router.route('/:id/like').get(isAuthenticated, likePost);
router.route('/:id/dislike').get(isAuthenticated, disLikePost);
router.route('/:id/comment').post(isAuthenticated, addComment);
router.route('/:id/comment/all').post(isAuthenticated, getCommentOfParticularPost);
router.route('/delete/:id').post(isAuthenticated, deletePost);
router.route('/:id/bookmark').post(isAuthenticated,BookmarkPost)



export default router