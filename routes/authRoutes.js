const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/signup' ,async (req, res) => {
    const {name ,email,password ,role} =req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // store hashed password in the password field
            role,
            isAdmin: role === 'admin' // set isAdmin based on role
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ error: 'User already exists' });
    }
});
// User login
router.post('/login', async (req, res) => {
    const { email, password, isAdmin } = req.body;

    try {
        // Ensure we're finding either a user or admin as per flag
        const role = isAdmin ? 'admin' : 'user';
        const user = await User.findOne({ email, role });

        if (!user) {   
            return res.status(404).json({ error: `${role === 'admin' ? 'Admin' : 'User'} not found` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ token, user: { name: user.name, role: user.role } });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/profile',async(req,res)=>{
    return res.status(200).json({message:"test"})
})

module.exports = router;
