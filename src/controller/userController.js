import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';

const register = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if(existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await prisma.user.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User registered successfully' });  
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });

    }
}

export default {
    register
};