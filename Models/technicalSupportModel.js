const mongoose = require('mongoose')

const TechnicalSupportSchema = mongoose.Schema({
    clientId: {
        type: String,
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
    emailId: {
        type: String,
        required : true
    },
    message:{
        type: String,
        required : true
    },
    status: {
        type: String,
        required : false
    },
},{
    timestamps: true
})


const TechnicalSupport = mongoose.model("TechnicalSupport",TechnicalSupportSchema)

module.exports = TechnicalSupport