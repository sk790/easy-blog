import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  deletepost,
  getposts,
  updatepost,
  likePost,
  // getpostsAdmin,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);
router.put("/like-post/:postId/:userId", verifyToken, likePost);

export default router;
