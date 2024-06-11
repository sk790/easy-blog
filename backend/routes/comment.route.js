import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getPostComments,
  likeComment,
  editComment
} from "../controllers/comment.controller.js";

const router = express.Router();

router.route("/create").post(verifyToken, createComment);
router.route("/get-post-comments/:postId").get(getPostComments);
router.route("/like-comment/:commentId").put(verifyToken, likeComment);
router.route("/edit-comment/:commentId").put(verifyToken, editComment);

export default router;
