import express from "express";
import {verifyToken} from "../middleware/index.js";

import {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment
} from "../controller/commentController.js";

const router = express.Router();
router.use(verifyToken);

router.post("/", createComment);
router.get("/post/:postId", getCommentsByPostId);
router.get("/:id", getCommentById);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;