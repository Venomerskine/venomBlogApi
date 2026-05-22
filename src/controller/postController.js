import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';


// Create a new post
 export const createPost =  async (req, res) => {
    try {
            const {title, content} = req.body;
            const authorId = req.user.userId;

            if(!title || !content || !authorId) {
                return res.status(400).json({message: "All fields are required"});
            }

            const user = await prisma.user.findUnique({
                where: {id: Number(authorId)}
            });

            if (!user) {
                return res.status(404).json({message: "Author not found"});
            }

            const post = await prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: Number(authorId)
                }
            });
            
            res.status(201).json({message: "Post created successfully", post});

    } catch (err) {
        console.error("CREATE POST ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
}


// Get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: true,
                comments: true
            },
                orderBy: {createdAt: 'desc'}
        });
        res.json({message: "Posts retrieved successfully", posts});
    } catch (err) {
        console.error("GET ALL POSTS ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
}

// Get a single post by ID
export const getPostById = async (req, res) => {
    try {
        const {postId} = req.params;
        console.log("GET POST BY ID Parameters:", {reqParams: req.params, postId});
        const post = await prisma.post.findUnique({
            where: {id: Number(postId)},
            include: {
                author: true,
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        console.log("GET POST BY ID:", post);
        if (!post) {
            return res.status(404).json({message: "Post not found"});
        }
        res.json({message: "Post retrieved successfully", post});
    } catch (err) {
        console.error("GET POST BY ID ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
}

// Update a post
export const updatePost = async (req, res) => {
    try {
        const {postId} = req.params;
        const {title, content} = req.body;

        const existingPost = await prisma.post.findUnique({
            where: {id: Number(postId)}
        });

        if (!existingPost) {
            return res.status(404).json({message: "Post not found"});
        }

        const updatedPost = await prisma.post.update({
            where: {id: Number(postId)},
            data: {
                title: title || existingPost.title,
                content: content || existingPost.content
            }
        });

        res.json({message: "Post updated successfully", post: updatedPost});
    } catch (err) {
        console.error("UPDATE POST ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
}

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const existingPost = await prisma.post.findUnique({
            where: { id: Number(postId) }
        });

        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        await prisma.post.delete({
            where: { id: Number(postId) }
        });

        res.json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error("DELETE POST ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// export default {
//     createPost,
//     getAllPosts,
//     getPostById,
//     updatePost,
//     deletePost
// }

