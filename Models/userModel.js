const mongoose = require ('mongoose');

const User = mongoose.Schema({
    firstname: {
        type: String,
        required : true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required : true
    }
})