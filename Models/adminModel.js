const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    Name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required : true
    }
})

const Admin = mongoose.model('Admin', AdminSchema)
module.exports = Admin;