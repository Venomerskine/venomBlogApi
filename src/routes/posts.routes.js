import express from 'express';

import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} from '../controller/postController.js';

const router = express.Router();

router.post('/posts', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

export default router;