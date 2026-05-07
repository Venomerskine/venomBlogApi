import express from "express";

import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} from "../controller/postController.js";

import {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment
} from "../controller/commentController.js";

import { verifyToken } from "../middleware/index.js";

const router = express.Router();



// POSTS

router.post("/", verifyToken, createPost);

router.get("/", getAllPosts);

router.get("/:postId", getPostById);

router.put("/:postId", verifyToken, updatePost);

router.delete("/:postId", verifyToken, deletePost);



// COMMENTS

router.post("/:postId/comments", verifyToken, createComment);

router.get("/:postId/comments", getCommentsByPostId);

router.get("/:postId/comments/:commentId", getCommentById);

router.put("/:postId/comments/:commentId", verifyToken, updateComment);

router.delete("/:postId/comments/:commentId", verifyToken, deleteComment);



export default router;