const mongoose = require('mongoose')

const TechnicalSupportSchema = mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required : true
    },
    firstname: {
        type: String,
        required : true
    },
    lastname: {
        type: String,
        required : true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    },
    emailId: {
        type: String,
        required : true
    },
    issuedate: {
        type: Date,
        required : true
    },
    closedate: {
        type: Date,
        required : true
    },
    status: {
        type: String,
        required : false
    }
})


const TechnicalSupport = mongoose.model("TechnicalSupport",TechnicalSupportSchema)

module.exports = TechnicalSupport