const cloudinary = require("../Middleware/cloudinary");
const Course = require("../Models/courseModel");
const path = require("path");
const fs = require('fs');
const Student = require("../Models/StudentModel");
const Batch = require("../Models/BatchModel");  

exports.createCourse = async (req, res) => {
  try {
    console.log(req.files);
    console.log(req.body);
    const {
      courseTitle,
      courseDescription,
      courseCategory,
      courseDuration,
      courseVideoTitle,
      courseLevel,
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
          { resource_type: "raw" }
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
      courseVideoTitle,
      courseLevel,
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
      courseVideoTitle,
      courseLevel,
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
      courseVideoTitle,
      courseLevel,
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

exports.registerCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.body.student;

    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the course is already registered for the student
    if (student.courses.includes(courseId)) {
      return res.status(400).json({ message: "Course already registered" });
    }

    // Find the latest batch for the course
    let latestBatch = await Batch.findOne({ courseId })
      .sort({ batchNumber: -1 })
      .exec();

    if (!latestBatch || latestBatch.students.length >= 15) {
      // If no batch exists or the latest batch is full, create a new batch
      const newBatchNumber = latestBatch ? latestBatch.batchNumber + 1 : 1;
      latestBatch = await Batch.create({
        courseId,
        batchNumber: newBatchNumber,
        students: [],
      });
    }

    // Add the student to the batch
    latestBatch.students.push(studentId);
    await latestBatch.save();

    // Add course to the student's list of courses and update batch number
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { 
        $push: { courses: courseId }, 
        batchNumber: latestBatch.batchNumber // Update the student's batch number
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Student registered and added to batch",
      batchNumber: latestBatch.batchNumber,
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get course by student id
exports.getCourseByStudentId = async (req, res) => {
  try {
    const courses = await Course.find({ student: req.params.id });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get course by category
exports.getCourseByCategory = async (req, res) => {
  try {
    const courses = await Course.find({ courseCategory: req.params.category });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get reading material based on courses registered by student
exports.getReadingMaterial = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find all courses registered by the student
    const courses = await Course.find({ _id: { $in: student.courses } });

    // Prepare response data including course details and attachments
    const courseDetailsWithAttachments = courses.map(course => ({
      courseId: course._id,
      courseTitle: course.courseTitle,
      courseDescription: course.courseDescription,
      courseCategory: course.courseCategory,
      courseLevel: course.courseLevel,
      courseDuration: course.courseDuration,
      courseVideo: course.courseVideo,
      courseThumbnail: course.courseThumbnail,
      attachments: course.courseAttachment,
    }));

    res.status(200).json({ courses: courseDetailsWithAttachments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

