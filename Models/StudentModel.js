const mongoose = require("mongoose");


const studentSchema = mongoose.Schema({
    Id:{
        type:String, 
        required:true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    Dob: {
        type: Date,
        required : true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    addressline1: {
        type: String,
        required: false
    },
    addressline2: {
        type: String,
        required: false 
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    zipcode: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    courseLevel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }]
})

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;