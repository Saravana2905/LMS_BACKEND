const Student = require('../Models/StudentModel');
const Trainer = require('../Models/trainermodel');
const Admin = require('../Models/adminModel')
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
        let student = await Student.findOne({ email });
        if (student) {
            // Verify password
            const isMatch = await bcrypt.compare(password, student.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            // Generate token
            const token = jwt.sign(
                { email: student.email, role: student.role, Id: student._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful --> student",
                token,
                role:student.role
            });
        } else {
            let admin = await Admin.findOne({ email });
            if (admin) {
                // Verify password
                const isMatch = await bcrypt.compare(password, admin.password);
                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials",
                    });
                }
    
                // Generate token
                const token = jwt.sign(
                    { email: admin.email, role: admin.role, Id: admin._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );
    
                return res.status(200).json({
                    success: true,
                    message: "Login successful ---> Admin",
                    token,
                    role: admin.role
                });
        }
    }



        // Check in the Trainer collection
        let trainer = await Trainer.findOne({ email });
        if (trainer) {
            // Verify password
            const isMatch = await bcrypt.compare(password, trainer.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            // Generate token
            const token = jwt.sign(
                { email: trainer.email, role: trainer.role, Id: trainer._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful ---> Trainer",
                token,
                role:trainer.role
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
