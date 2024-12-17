const mongoose = require('mongoose')

const TestSchema = mongoose.Schema({
    question1: {
        type: String,
        required: true
    },
    question2:{
        type: String,
        required: true
    },
    question3:{
        type: String,
        required: true
    },
    question4:{
        type: String,
        required: true
    }
})