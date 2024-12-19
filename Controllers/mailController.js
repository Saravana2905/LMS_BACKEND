require('dotenv').config();
const emailjs = require('emailjs-com');

const sendEmails = async (req, res) => {
    const { recipients, subject, text, html } = req.body;

    if (!recipients || !subject || (!text && !html)) {
        return res.status(400).json({
            error: "Please provide all required fields: recipients, subject, text or html."
        });
    }

    try {
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {
                to_email: recipients.join(', '),
                subject: subject,
                message: text || html,
            },
            process.env.EMAILJS_USER_ID
        );
        console.log('Message sent: %s', response.status);
        res.status(200).send('Emails sent successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error sending emails');
    }
};

module.exports = {
    sendEmails
};
