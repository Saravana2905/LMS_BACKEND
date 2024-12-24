const mongoose = require('mongoose');
const Batch = require('../Models/BatchModel');

const ProjectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc:{
        type: String,
        required : true
    },
    courseLevel : {
        type: String,
        values: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    projectTpye:{
        type: String,
        values: ['Individual', 'Group'],
        required: true
    },
    Batch:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    projectTime:{
        type: Number,
        required: true
    },
    projectSubmission:{
        type: String,
        required: false
    },
    projectEndDate:{
        type: Date,
        required: true
    },
    projectStatus:{
        type: String,
        values: ['pending', 'completed','not Submitted'],
        required: false
    }
})

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;