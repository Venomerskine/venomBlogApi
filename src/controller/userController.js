import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';

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

export default {
    register,
    login
};