import express from "express";
import { register, login, verify,registerBlogger, loginBlogger } from "../controller/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/blogger/register", registerBlogger);
router.post("/login", login);
router.post("/blogger/login", loginBlogger);
router.get("/auth/verify", verify)

export default router;