const Batch = require('../Models/BatchModel');


exports.getBatchesByCourseId = async (req, res) => {
    try {
      const courseId = req.params.id;
  
      // Find all batches for the course
      const batches = await Batch.find({ courseId }).populate('students', 'name email');
  
      res.status(200).json({ success: true, batches });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  exports.getBatchByStudentId = async (req, res) => {
    try {
      const studentId = req.params.id;
  
      // Find all batches where the student is registered
      const batches = await Batch.find({ students: studentId }).populate('courseId', 'courseTitle courseDescription');
  
      res.status(200).json({ success: true, batches });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  