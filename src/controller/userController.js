import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';

// Register a new user
export const register = async (req, res) => {
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
export const login = async (req, res) => {

    console.log("Login request body:", req.body);
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

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({
            where: {id: Number(userId)},
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) return res.status(404).json({message: "User not found"});

        res.json({message: "User profile retrieved successfully", user});
    } catch (err) {
        console.error("GET PROFILE ERROR:", err);
        res.status(500).json({ message: 'Error retrieving profile' });
    }
}

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {firstName, lastName} = req.body;

        const updatedUser = await prisma.user.update({
            where: {id: Number(userId)},
            data: {
                firstName: firstName || undefined,
                lastName: lastName || undefined
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true
            }
        });

        res.json({message: "Profile updated successfully", user: updatedUser});
    } catch (err) {
        console.error("UPDATE PROFILE ERROR:", err);
        res.status(500).json({ message: 'Error updating profile' });
    }
}

// Delete user account
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.userId;

        await prisma.user.delete({
            where: {id: Number(userId)}
        });

        res.json({message: "Account deleted successfully"});
    }       catch (err) {       
        console.error("DELETE ACCOUNT ERROR:", err);
        res.status(500).json({ message: 'Error deleting account' });
    }
}


//export default {
//    register,
//    login,
//}