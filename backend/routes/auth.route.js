import express from "express"
import { google, signIn, signUp } from "../controllers/auth.controller.js";

const router = express.Router()

router.route("/sign-up").post(signUp)
router.route("/sign-in").post(signIn)
router.route("/google").post(google)

export default router;