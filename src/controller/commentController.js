import prisma from '../../prisma/prismaClient.js';

// Create a new comment

export const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { comment, } = req.body;
        console.log("Create comment request body:", req.body);
        console.log("Create comment request params:", req.params);

        console.log("Create comment request body:", req.body);
        console.log("Create comment request params:", req.params);

        // Check if the post exists
        const existingPost = await prisma.post.findUnique({
            where: { id: Number(postId) }
        });

        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = await prisma.comment.create({
            data: {
                content: comment,
                post: {
                    connect: { id: Number(postId) }
                },

                author: {
                    connect: { id: Number(req.user.userId) }
                }
            }
        });

        res.status(201).json({ message: "Comment created successfully", comment: newComment });
    } catch (err) {
        console.error("CREATE COMMENT ERROR:", err);
        res.status(500).json({ message: "Internal server error" });
    }

}

// Get all comments for a post
export const getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;

        // Check if the post exists
        const existingPost = await prisma.post.findUnique({
            where: { id: Number(postId) }
        });

        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = await prisma.comment.findMany({
            where: { postId: Number(postId) },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ message: "Comments retrieved successfully", comments });
    } catch (err) {
        console.error("GET COMMENTS BY POST ID ERROR:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Update a comment
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const commentId = Number(id);

        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!existingComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { content }
        });

        res.json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (err) {
        console.error("UPDATE COMMENT ERROR:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete a comment
export const deleteComment = async (req, res) => {
    console.log("Delete comment request params:", req.params);

    try {
        const { commentId } = req.params;
        const parsedCommentId = Number(commentId);

        console.log("Delete comment id:", parsedCommentId);

        if (isNaN(parsedCommentId)) {
            return res.status(400).json({ message: "Invalid comment ID" });
        }

        const existingComment = await prisma.comment.findUnique({
            where: { id: parsedCommentId }
        });

        if (!existingComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        await prisma.comment.delete({
            where: { id: parsedCommentId }
        });

        res.json({ message: "Comment deleted successfully" });

    } catch (err) {
        console.error("DELETE COMMENT ERROR:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get comment by id
export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const commentId = Number(id);
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.json({ message: "Comment retrieved successfully", comment });
    } catch (err) {
        console.error("GET COMMENT BY ID ERROR:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}