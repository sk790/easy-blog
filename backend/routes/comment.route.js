import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createComment,getPostComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.route("/create").post(verifyToken, createComment);
router.route("/get-post-comments/:postId").get(getPostComments);

export default router




