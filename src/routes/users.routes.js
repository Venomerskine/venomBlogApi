import express from "express";
import { register, login, verify } from "../controller/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/auth/verify", verify)

export default router;