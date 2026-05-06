import prisma from "../../prisma/prismaClient";

// Create a new comment

export const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        // Check if the post exists
        const existingPost = await prisma.post.findUnique({
            where: { id: Number(postId) }
        });

        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                postId: Number(postId)
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

        const existingComment = await prisma.comment.findUnique({
            where: { id: Number(id) }
        });

        if (!existingComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: Number(id) },
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
    try {
        const { id } = req.params;

        const existingComment = await prisma.comment.findUnique({
            where: { id: Number(id) }
        });

        if (!existingComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        await prisma.comment.delete({
            where: { id: Number(id) }
        });

        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error("DELETE COMMENT ERROR:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}   

// get comment by id
export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) }
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