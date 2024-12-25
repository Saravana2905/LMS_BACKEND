const cloudinary = require("../Middleware/cloudinary");
const Student = require("../Models/StudentModel");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const Counter = require("../Models/counterModel"); // Counter model for tracking the sequence
const jwt = require("jsonwebtoken");

exports.createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      Dob,
      email,
      mobile,
      addressline1,
      addressline2,
      city,
      state,
      country,
      zipcode,
      password,
    } = req.body;

    // Check if the student already exists
    const oldStudent = await Student.findOne({ email });
    if (oldStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists with this email",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImageUrl;
    if (req.files?.profileImage) {
      const imagePath = path.resolve(req.files.profileImage[0].path);
      const imageUpload = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image",
      });
      profileImageUrl = imageUpload.secure_url;
      fs.unlinkSync(imagePath);
    }

    // Function to generate a sequential unique ID
    async function generateUniqueId() {
      const currentYear = new Date().getFullYear();
      const counter = await Counter.findOneAndUpdate(
        { key: `iTrain-${currentYear}` },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      const formattedValue = String(counter.value).padStart(4, "0");
      return `iTrain-${currentYear}${formattedValue}`;
    }

    const studentId = await generateUniqueId();

    const student = await Student.create({
      Id: studentId,
      firstName,
      lastName,
      gender,
      Dob,
      email,
      mobile,
      addressline1,
      addressline2,
      city,
      state,
      country,
      zipcode,
      password: hashedPassword,
      profileImage: profileImageUrl,
      role: "Student",
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
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
    const students = await Student.find().populate("courses");
    const totalStudents = await Student.countDocuments();
    res.status(200).json({
      success: true,
      totalStudents,
      students,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve students",
      error: error.message,
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).populate("courses");
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve student",
      error: error.message,
    });
  }
}

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    // Validate input fields
    if (req.body.firstName) updateData.firstName = req.body.firstName;
    if (req.body.lastName) updateData.lastName = req.body.lastName;
    if (req.body.gender) updateData.gender = req.body.gender;
    if (req.body.Dob) updateData.Dob = req.body.Dob;
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
    if (req.body.addressline1) updateData.addressline1 = req.body.addressline1;
    if (req.body.addressline2) updateData.addressline2 = req.body.addressline2;
    if (req.body.city) updateData.city = req.body.city;
    if (req.body.state) updateData.state = req.body.state;
    if (req.body.country) updateData.country = req.body.country;
    if (req.body.zipcode) updateData.zipcode = req.body.zipcode;

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
      student,
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
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Student deletion failed",
      error: error.message,
    });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if the student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
console.log( student,"test");
    // Generate a JWT
    const token = jwt.sign(
      { id: student._id, email: student.email, role: student.role },
      process.env.JWT_SECRET, // Ensure this is set in your environment variables
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        role: student.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
