import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getAllComments,
  adminDeleteComment
} from "../controllers/comment.controller.js";

const router = express.Router();

router.route("/create").post(verifyToken, createComment);
router.route("/get-post-comments/:postId").get(getPostComments);
router.route("/like-comment/:commentId").put(verifyToken, likeComment);
router.route("/edit-comment/:commentId").put(verifyToken, editComment);
router.route("/delete-comment/:commentId").delete(verifyToken, deleteComment);
router.route("/get-all-comments").get(verifyToken, getAllComments);
router.route("/admin-delete-comment/:commentId").delete(verifyToken, adminDeleteComment);

export default router;
