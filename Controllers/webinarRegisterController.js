const webinarRegister = require('../Models/webinarRegisterModel');
const webinar = require('../Models/webinarModel');

exports.registerWebinar = async (req, res) =>{
    try {
        const { webinarId, firstName, lastName, email, phone, country, state, city } = req.body;
        console.log(req.body);
        const webinarObj = await webinar.findById(webinarId);
        if(!webinarObj){
            return res.status(404).json({ error: 'Webinar not found' });
        }
        const WebinarRegister = webinarRegister.create({
            webinar: webinarId,
            firstName,
            lastName,
            email,
            phone,
            country, 
            state,
            city
        })
        res.status(200).json({ message: 'Webinar registered successfully', data: WebinarRegister });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getWebinarRegistrations = async (req, res) => {
    try {
        const webinarRegistrations = await webinarRegister.find().populate('webinar', 'webinarTitle');
        res.status(200).json(webinarRegistrations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


exports.getWebinarRegistrationById = async (req, res) => {
    try {
        const webinarRegistration = await webinarRegister.findById(req.params.id).populate('webinar', 'webinarTitle');
        if (!webinarRegistration) {
            return res.status(404).json({ error: 'Webinar registration not found' });
        }
        res.status(200).json(webinarRegistration);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
