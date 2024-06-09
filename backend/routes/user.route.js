import express from "express";
import { updateUser} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();


router.route("/update-user").put(verifyToken, updateUser)


export default router;