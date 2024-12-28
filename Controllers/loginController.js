const Student = require('../Models/StudentModel');
const Trainer = require('../Models/trainermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Assuming you're hashing passwords for security

exports.login = async (req, res) => {
    const { email, password } = req.body; // Ensure these fields are sent in the request body

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Check in the Student collection
        let user = await Student.findOne({ email });
        if (user) {
            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            // Generate token
            const token = jwt.sign(
                { email: user.email, role: user.role, Id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
            });
        }

        // Check in the Trainer collection
        user = await Trainer.findOne({ email });
        if (user) {
            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            // Generate token
            const token = jwt.sign(
                { email: user.email, role: user.role, Id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
            });
        }

        // If no user found in either collection
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};
