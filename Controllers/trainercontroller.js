const cloudinary = require("../Middleware/cloudinary");
const Trainer = require("../Models/trainermodel");
const path = require("path");
const fs = require('fs');

exports.createTrainer = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      mobileNumber,
      mailId,
      city,
      myCourse
    } = req.body;

    let imageUrl, resumeUrl;

    // Upload trainer image
    if (req.files.image) {
      const imagePath = path.resolve(req.files.image[0].path);
      const imageUpload = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
      fs.unlinkSync(imagePath);
    }

    // Upload trainer resume
    if (req.files.resume) {
      const resumePath = path.resolve(req.files.resume[0].path);
      const resumeUpload = await cloudinary.uploader.upload(resumePath, {
        resource_type: "auto",
      });
      resumeUrl = resumeUpload.secure_url;
      fs.unlinkSync(resumePath);
    }

    const trainer = await Trainer.create({
      firstname,
      lastname,
      mobileNumber,
      mailId,
      image: imageUrl,
      resume: resumeUrl,
      city,
      myCourse
    });

    res.status(201).json({ 
        success: true, 
        message: "Trainer created successfully", 
        trainer 
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Trainer creation failed",
      error: error.message,
    });
  }
};

exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    const totalTrainers = await Trainer.countDocuments();
    res.status(200).json({ 
      success: true, 
      totalTrainers,
      trainers 
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve trainers",
      error: error.message,
    });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Request ID: ", id);
    console.log("Request Body: ", req.body);

    // Only update fields that are provided in the request body
    const updateData = {};
    if (req.body.firstname) updateData.firstname = req.body.firstname;
    if (req.body.lastname) updateData.lastname = req.body.lastname;
    if (req.body.mobileNumber) updateData.mobileNumber = req.body.mobileNumber;
    if (req.body.mailId) updateData.mailId = req.body.mailId;
    if (req.body.city) updateData.city = req.body.city;
    if (req.body.myCourse) updateData.myCourse = req.body.myCourse;

    let imageUrl, resumeUrl;

    // Upload trainer image if provided
    if (req.files && req.files.image) {
      const imagePath = path.resolve(req.files.image[0].path);
      const imageUpload = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
      updateData.image = imageUrl; // Add image URL to updateData
      fs.unlinkSync(imagePath);
    }

    // Upload trainer resume if provided
    if (req.files && req.files.resume) {
      const resumePath = path.resolve(req.files.resume[0].path);
      const resumeUpload = await cloudinary.uploader.upload(resumePath, {
        resource_type: "auto",
      });
      resumeUrl = resumeUpload.secure_url;
      updateData.resume = resumeUrl; // Add resume URL to updateData
      fs.unlinkSync(resumePath);
    }

    const trainer = await Trainer.findByIdAndUpdate(id, updateData, { new: true });
    if (!trainer) {
      console.log("Trainer not found for ID: ", id);
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    console.log("Updated Trainer: ", trainer);
    res.status(200).json({ 
      success: true, 
      message: "Trainer updated successfully", 
      trainer 
    });
  } catch (error) {
    console.error("Update Error: ", error);
    res.status(400).json({
      success: false,
      message: "Trainer update failed",
      error: error.message,
    });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findByIdAndDelete(id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Trainer deleted successfully" 
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Trainer deletion failed",
      error: error.message,
    });
  }
};

// ... additional methods for getting, updating, and deleting trainers ...
