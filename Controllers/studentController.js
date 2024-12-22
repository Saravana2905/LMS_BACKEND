const cloudinary = require("../Middleware/cloudinary");
const Student = require("../Models/StudentModel");
const path = require("path");
const fs = require('fs');
const bcrypt = require('bcrypt');

exports.createStudent = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      email,
      mobile,
      alternateMobile,
      address,
      password,
      confirmPassword
    } = req.body;

    // Check if the student already exists
    const oldStudent = await Student.findOne({ email }); // Use findOne to check for existing student
    if (oldStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists with this email",
      });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10); // Hash confirmPassword

    let profileImageUrl;

    // Upload student profile image
    if (req.files.profileImage) {
      const imagePath = path.resolve(req.files.profileImage[0].path);
      const imageUpload = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image",
      });
      profileImageUrl = imageUpload.secure_url;
      fs.unlinkSync(imagePath);
    }
    // Function to generate a unique ID
      function generateUniqueId() {
      return 'student-' + Date.now(); // Simple unique ID generation
      }

    const studentId = generateUniqueId();

    const student = await Student.create({
      Id:studentId,
      firstName,   
      lastName,
      email,
      mobile,
      alternateMobile,
      address,
      password: hashedPassword,
      profileImage: profileImageUrl,
      role :"Student",
    });

    res.status(201).json({ 
        success: true, 
        message: "Student created successfully", 
        student 
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Student creation failed",
      error: error.message,
    });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    const totalStudents = await Student.countDocuments();
    res.status(200).json({ 
      success: true, 
      totalStudents,
      students 
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve students",
      error: error.message,
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    // Validate input fields
    if (req.body.firstName) updateData.firstName = req.body.firstName;
    if (req.body.lastName) updateData.lastName = req.body.lastName;
    if (req.body.email) {
      const existingStudent = await Student.findOne({ email: req.body.email });
      if (existingStudent && existingStudent._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another student",
        });
      }
      updateData.email = req.body.email;
    }
    if (req.body.mobile) updateData.mobile = req.body.mobile;
    if (req.body.alternateMobile) updateData.alternateMobile = req.body.alternateMobile;
    if (req.body.address) updateData.address = req.body.address;

    // Only update password if provided
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateData.password = hashedPassword;
    }

    const student = await Student.findByIdAndUpdate(id, updateData, { new: true });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Student updated successfully", 
      student 
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Student update failed",
      error: error.message,
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Student deleted successfully" 
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Student deletion failed",
      error: error.message,
    });
  }
};