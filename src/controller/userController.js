import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';

// Register a new user
const register = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    console.log("Icoming body:", req.body);
    console.log("Password type:", typeof password);
    if (!password || typeof password !== "string") {
    return res.status(400).json({ message: "Password is required" });
}

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        console.log("Existing user check:", existingUser);
        if(existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: 'User registered successfully' });  
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: 'Error registering user' });
}
}


// Login user and return JWT token
const login = async (req, res) => {
    const {email, password} = req.body;

    console.log("Login body:", req.body);
    console.log("Email:", email);
    console.log("Password:", password);

    const user = await prisma.user.findUnique({
        where: {email}
    });

    if (!user) return res.status(401).json({message: "invalid user credentials"})

    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) return res.status(401).json({message: "Wrong password"});

    const token = jwt.sign(
        {userId: user.id, email:user.email},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )
    res.json({message: "Login successful", token});
}

// Create a new post
const createPost =  async (req, res) => {
    try {
            const {title, content, authorId} = req.body;

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
const getAllPosts = async (req, res) => {
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
    
export default {
    register,
    login,
    createPost,
    getAllPosts
}