import express from "express";
import {
  updateUser,
  deleteUser,
  signOut,
  getUsers,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.route("/update/:userId").put(verifyToken, updateUser);
router.route("/delete/:userId").delete(verifyToken, deleteUser);
router.route("/signout").post(verifyToken, signOut);
router.route("/getusers").get(verifyToken, getUsers);
// router.route("/delete/:userId").get(verifyToken, getUsers);
router.route("/:userId").get(getUser);


export default router;
