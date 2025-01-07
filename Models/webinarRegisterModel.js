const mongoose = require('mongoose');

const webinarRegisterSchema = mongoose.Schema({
    webinar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Webinar',
        required: true
    },
    firstName: {
        type: String,
        ref: 'User',
        required: true
    },
    lastName:{
        type: String,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        ref: 'User',
        required: true
    },
    phone: {
        type: Number,
        ref: 'User',
        required: true
    },
    country:{
        type: String,
        ref: 'User',
        required: true
    },
    state:{
        type: String,
        ref: 'User',
        required: true
    },
    city:{
        type: String,
        ref: 'User',
        required: true
    }

})

const WebinarRegister = mongoose.model('WebinarRegister', webinarRegisterSchema);
module.exports = WebinarRegister;