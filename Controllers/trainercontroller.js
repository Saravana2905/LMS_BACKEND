const Trainer = require("../Models/trainermodel");
const path = require("path");
const fs = require('fs');
const slugify = require("slugify");

exports.createTrainer = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      mobileNumber,
      mailId,
      password,
      myCourse,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl, resumeUrl;

    // Folder path to store the trainer's files
    const trainerFolderName = slugify(`${firstname}-${lastname}`, { lower: true, strict: true });
    const trainerFolderPath = path.join(__dirname,  '..', '..', '..', 'uploads', trainerFolderName);

    // Ensure the trainer folder exists
    if (!fs.existsSync(trainerFolderPath)) {
      fs.mkdirSync(trainerFolderPath, { recursive: true });
    }

    // Upload trainer image and get the image URL
    if (req.files.image) {
      const imagePath = path.join(trainerFolderPath, req.files.image[0].originalname);
      fs.renameSync(req.files.image[0].path, imagePath);
      imageUrl = `${req.protocol}://${req.get('host')}/files/${trainerFolderName}/${req.files.image[0].originalname}`;
    }

    // Upload trainer resume and get the resume URL
    if (req.files.resume) {
      const resumePath = path.join(trainerFolderPath, req.files.resume[0].originalname);
      fs.renameSync(req.files.resume[0].path, resumePath);
      resumeUrl = `${req.protocol}://${req.get('host')}/files/${trainerFolderName}/${req.files.resume[0].originalname}`;
    }

    // Create the trainer record in the database
    const trainer = await Trainer.create({
      firstname,
      lastname,
      mobileNumber,
      mailId,
      password: hashedPassword,
      image: imageUrl,
      resume: resumeUrl,
      myCourse,
      role: "Trainer",
    });

    res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      trainer,
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
    if (req.body.myCourse) updateData.myCourse = req.body.myCourse;
    if (!req.body.role) updateData.role = "Trainer";

    // Folder path to store trainer's updated files
    const trainerFolderName = slugify(`${updateData.firstname}-${updateData.lastname}`, { lower: true, strict: true });
    const trainerFolderPath = path.join(__dirname, '..','..', '..', 'uploads', trainerFolderName);

    // Ensure the trainer folder exists
    if (!fs.existsSync(trainerFolderPath)) {
      fs.mkdirSync(trainerFolderPath, { recursive: true });
    }

    let imageUrl, resumeUrl;

    // Upload trainer image if provided
    if (req.files && req.files.image) {
      const imagePath = path.join(trainerFolderPath, req.files.image[0].originalname);
      fs.renameSync(req.files.image[0].path, imagePath); // Save the image locally
      imageUrl = `${req.protocol}://${req.get('host')}/files/${trainerFolderName}/${req.files.image[0].originalname}`;
      updateData.image = imageUrl; // Update the image URL
    }

    // Upload trainer resume if provided
    if (req.files && req.files.resume) {
      const resumePath = path.join(trainerFolderPath, req.files.resume[0].originalname);
      fs.renameSync(req.files.resume[0].path, resumePath); // Save the resume locally
      resumeUrl = `${req.protocol}://${req.get('host')}/files/${trainerFolderName}/${req.files.resume[0].originalname}`;
      updateData.resume = resumeUrl; // Update the resume URL
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
      trainer,
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
