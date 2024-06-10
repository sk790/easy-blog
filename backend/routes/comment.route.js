import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.route("/create").post(verifyToken, createComment);

export default router




