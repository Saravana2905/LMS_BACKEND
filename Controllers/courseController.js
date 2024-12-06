const cloudinary = require("../Middleware/cloudinary");
const Course = require("../Models/courseModel");
const path = require("path");
const fs = require('fs');

exports.createCourse = async (req, res) => {
  try {
    console.log(req.files);
    console.log(req.body);
    const {
      courseTitle,
      courseDescription,
      courseCategory,
      courseDuration,
      courseSeat,
      courseAmount,
      courseVideoTitle,
    } = req.body;
    let courseVideoUrl, courseThumbnailUrl;
    const courseAttachmentUrls = []; // Upload course video
    if (req.files.courseVideo) {
      const videoPath = path.resolve(req.files.courseVideo[0].path);
      const videoUpload = await cloudinary.uploader.upload(videoPath, {
        resource_type: "video",
      });
      courseVideoUrl = videoUpload.secure_url;
      fs.unlinkSync(videoPath);
    } // Upload course thumbnail
    if (req.files.courseThumbnail) {
      const imagePath = path.resolve(req.files.courseThumbnail[0].path);
      const imageUpload = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image",
      });
      courseThumbnailUrl = imageUpload.secure_url;
      fs.unlinkSync(imagePath);
    } // Upload course attachments
    if (req.files.courseAttachment) {
      for (const file of req.files.courseAttachment) {
        const attachmentPath = path.resolve(file.path);
        const attachmentUpload = await cloudinary.uploader.upload(
          attachmentPath,
          { resource_type: "auto" }
        );
        courseAttachmentUrls.push(attachmentUpload.secure_url);
        fs.unlinkSync(attachmentPath);
      }
    }
    const course = await Course.create({
      courseTitle,
      courseDescription,
      courseCategory,
      courseDuration,
      courseSeat,
      courseAmount,
      courseVideoTitle,
      courseVideo: courseVideoUrl,
      courseThumbnail: courseThumbnailUrl,
      courseAttachment: courseAttachmentUrls,
    });
    res
      .status(201)
      .json({ success: true, message: "Course created successfully", course });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: "Course creation failed",
        error: error.message,
      });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourseById = async (req, res) => {
  try {
    const {
      courseTitle,
      courseDescription,
      courseCategory,
      courseDuration,
      courseSeat,
      courseAmount,
      courseVideoTitle,
    } = req.body;

    let courseVideoUrl, courseThumbnailUrl;
    const courseAttachmentUrls = []; // Prepare for updated attachments

    // Upload course video if provided
    if (req.files.courseVideo) {
      const videoPath = path.resolve(req.files.courseVideo[0].path);
      const videoUpload = await cloudinary.uploader.upload(videoPath, {
        resource_type: "video",
      });
      courseVideoUrl = videoUpload.secure_url;
    }

    // Upload course thumbnail if provided
    if (req.files.courseThumbnail) {
      const imagePath = path.resolve(req.files.courseThumbnail[0].path);
      const imageUpload = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image",
      });
      courseThumbnailUrl = imageUpload.secure_url;
    }

    // Upload course attachments if provided
    if (req.files.courseAttachment) {
      for (const file of req.files.courseAttachment) {
        const attachmentPath = path.resolve(file.path);
        const attachmentUpload = await cloudinary.uploader.upload(
          attachmentPath,
          { resource_type: "auto" }
        );
        courseAttachmentUrls.push(attachmentUpload.secure_url);
      }
    }

    // Update course with new data
    const course = await Course.findByIdAndUpdate(req.params.id, {
      courseTitle,
      courseDescription,
      courseCategory,
      courseDuration,
      courseSeat,
      courseAmount,
      courseVideoTitle,
      courseVideo: courseVideoUrl,
      courseThumbnail: courseThumbnailUrl,
      courseAttachment: courseAttachmentUrls,
    }, { new: true });

    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

exports.deleteCourseById = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAllCourses = async (req, res) => {
  try {
    await Course.deleteMany();
    res.status(200).json({ message: "All courses deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
