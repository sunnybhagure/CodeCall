const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,
         { expiresIn: '7d' });
}

exports.registerUser = async (req, res) => {
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);
        res.status(201).json({ token });
    } catch (error) {
    console.log(error);
    res.status(500).json({
        message: "Server error",
        error: error.message
    });
}
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.json({ token });
    } catch (error) {
    console.log(error);
    res.status(500).json({
        message: "Server error",
        error: error.message
    });
}
};
