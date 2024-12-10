const cloudinary = require("../Middleware/cloudinary");
const Student = require("../Models/studentmodel");
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

    const student = await Student.create({
      firstName,
      lastName,
      email,
      mobile,
      alternateMobile,
      address,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
      profileImage: profileImageUrl
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
    if (req.body.firstName) updateData.firstName = req.body.firstName;
    if (req.body.lastName) updateData.lastName = req.body.lastName;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.mobile) updateData.mobile = req.body.mobile;
    if (req.body.alternateMobile) updateData.alternateMobile = req.body.alternateMobile;
    if (req.body.address) updateData.address = req.body.address;

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

// ... additional methods for getting, updating, and deleting students ...
