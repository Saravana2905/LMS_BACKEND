const DoubtSession = require("../Models/DoubtSessionModel");
const Student = require("../Models/StudentModel");
const Trainer = require("../Models/trainermodel");
const axios = require("axios");
const nodemailer = require('nodemailer');

exports.createDoubtSession = async (req, res) => {
  try {
    const {
      doubt,
      studentId,
      trainerId,
      sessionDate,
      sessionTime,
      timeZone,
    } = req.body;

    const student = await Student.findById(studentId);
    const trainer = await Trainer.findById(trainerId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Get the access token from Zoom
    const tokenResponse = await axios.post(
      "https://zoom.us/oauth/token",
      null,
      {
        params: {
          grant_type: "account_credentials",
          account_id: process.env.ZOOM_ACCOUNT_ID,
          client_id: process.env.ZOOM_CLIENT_ID,
          client_secret: process.env.ZOOM_CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Create the webinar using Zoom API
    const webinarResponse = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Doubt Session",
        type: 2,
        start_time: new Date(sessionDate + "T" + sessionTime).toISOString(),
        duration: 40,
        settings: {
          host_video: true,
          participant_video: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { join_url } = webinarResponse.data;

    // Create and save the doubt session
    const newDoubtSession = new DoubtSession({
      doubt,
      student: studentId,
      trainer: trainerId,
      sessionDate,
      sessionTime,
      timeZone,
      joinUrl: join_url,
    });

    await newDoubtSession.save();

    // Prepare email data
    const emailData = {
      Topic: doubt,
      Date: sessionDate,
      Time: sessionTime,
      Link: join_url,
      name: `${student.firstName} ${student.lastName}`,
      email: `${student.email}`,
      TimeZone:timeZone,
    };

    // Send email
    const transporter = nodemailer.createTransport({
      host: 'smtppro.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'lokkesh.raaj@titatechnology.com',
      to: emailData.email,
      subject: `Doubt Session Scheduled: ${emailData.webinartitle}`,
      html: `
            <!DOCTYPE html>
            
            <html lang="en">
            
            <head>
            
                <meta charset="UTF-8">
            
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
                <title>Webinar Invitation</title>
            
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
            
                <style>
            
                    body {
            
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            
                        line-height: 1.6;
            
                        color: #333;
            
                        margin: 0;
            
                        padding: 0;
            
                        background-color: #f7f7f7;
            
                    }
            
                    .container {
            
                        padding: 40px;
            
                        background-color: #ffffff;
            
                        border: 1px solid #e0e0e0;
            
                        border-radius: 12px;
            
                        max-width: 600px;
            
                        margin: 30px auto;
            
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            
                    }
            
                    .header {
            
                        text-align: center;
            
                        margin-bottom: 30px;
            
                        padding: 20px;
            
                    }
            
                    .header img {
            
                        width: 7cm;
            
                        height: auto;
            
                    }
            
                    .header h2 {
            
                        font-size: 1.8em;
            
                        color: #ff010e;
            
                        font-weight: 600;
            
                        margin: 0;
            
                    }
            
                    .content p {
            
                        font-size: 1em;
            
                        color: #555;
            
                        margin-bottom: 20px;
            
                    }
            
                    .content ul {
            
                        padding-left: 20px;
            
                        margin-bottom: 20px;
            
                    }
            
                    .content ul li {
            
                        margin-bottom: 10px;
            
                        font-size: 1em;
            
                        color: #333;
            
                    }
            
                    .content a {
            
                        color: #0078d4;
            
                        text-decoration: none;
            
                        font-weight: 500;
            
                    }
            
                    .content a:hover {
            
                        text-decoration: underline;
            
                    }
            
                    .cta {
            
                        text-align: center;
            
                        margin-top: 20px;
            
                    }
            
                    .cta a {
            
                        background-color: #ff010e;
            
                        color: #ffffff;
            
                        padding: 12px 24px;
            
                        border-radius: 8px;
            
                        text-decoration: none;
            
                        font-size: 1em;
            
                        font-weight: bold;
            
                        display: inline-block;
            
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            
                    }
            
                    .cta a:hover {
            
                        background-color: #0a0909;
            
                        text-decoration: none;
            
                    }
            
                    .footer {
            
                        font-size: 0.9em;
            
                        color: #777;
            
                        text-align: center;
            
                        margin-top: 30px;
            
                    }
            
                    .footer a {
            
                        color: #0078d4;
            
                        text-decoration: none;
            
                    }
            
                    .footer a:hover {
            
                        text-decoration: underline;
            
                    }
            
                    .social-icons {
            
                        margin-top: 20px;
            
                    }
            
                    .social-icons a {
            
                        margin: 0 10px;
            
                        color: #333;
            
                        font-size: 1.2em;
            
                        text-decoration: none;
            
                    }
            
                    .social-icons a:hover {
            
                        color: #ff010e;
            
                    }
            
                    /* Responsive Styles */
            
                    @media (max-width: 768px) {
            
                        .header h2 {
            
                            font-size: 1.5em;
            
                        }
            
                        .container {
            
                            padding: 25px;
            
                        }
            
                    }
            
                    @media (max-width: 480px) {
            
                        .header img {
            
                            width: 100px;
            
                        }
            
                        .header h2 {
            
                            font-size: 1.2em;
            
                        }
            
                        .content p {
            
                            font-size: 0.9em;
            
                        }
            
                    }
            
                </style>
            
            </head>
            
            <body>
            
                <div class="container">
            
                    <div class="header">
            
                        <img src="https://titatechnology.com/assets/img/logo.png" alt="TITA Technologies Logo">
            
                        <h2>Doubt Session</h2>
            
                    </div>
            
                    <div class="content">
            
                        <p>Hi ${emailData.name},</p>
            
                        <p>TITA Technologies Inc. warmly welcomes you to join our <strong>FREE Webinar</strong> to get to know more about our world-class IT Training and its key benefits and features. Don’t miss this great opportunity to transform your career! Below are the Webinar meeting details:</p>
            
                        <ul>
            
                            <li><strong>Topic:</strong> ${emailData.Topic}</li>
            
                            <li><strong>Date:</strong> ${emailData.Date}</li>
            
                            <li><strong>Time:</strong> ${emailData.Time} </li>

                            <li><strong>TimeZone:</strong> ${emailData.TimeZone} </li>
            
                            <li><strong>Link:</strong> <a href="${emailData.Link}" target="_blank">${emailData.Link}</a></li>
            
                         
            
                        </ul>
            
                        <div class="cta">
            
                            <a href="${emailData.Link}" target="_blank">Join Webinar</a>
            
                        </div>
            
                        <p>We look forward to seeing you there!</p>
            
                      <a href="https://www.facebook.com/share/g/15TsxRRC1h/" target="_blank">join our community</a>
            
                        <p>Best regards,<br>TITA Technologies Team</p>
            
                    </div>
            
                    <div class="footer">
            
                        <p>If you have any questions, feel free to <a href="mailto:contact@titatechnology.com">contact us</a>.</p>
            
                        <div class="social-icons">
            
                            <a href="https://www.facebook.com/share/15nNHb6u7n/?mibextid=wwXIfr" target="_blank"><img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/svgs/brands/facebook.svg" alt="Facebook" style="width: 24px; height: 24px;"></a>
            
                            <a href="https://x.com/tita_global?s=11" target="_blank"><img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/svgs/brands/twitter.svg" alt="Twitter" style="width: 24px; height: 24px;"></a>
            
                            <a href="https://www.linkedin.com/company/tita-technologies/" target="_blank"><img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/svgs/brands/linkedin.svg" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
            
                            <a href="https://www.instagram.com/tita_technologies_global/profilecard/?igsh=MThwcTc4dGw1ZXp3MA==" target="_blank"><img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/svgs/brands/instagram.svg" alt="Instagram" style="width: 24px; height: 24px;"></a>
            
                        </div>
            
                    </div>
            
                </div>
            
            </body>
            
            </html>
            
             
            
                   
            
                    `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Doubt session created and email sent", newDoubtSession });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getDoubtSessions = async (req, res) => {
  try {
    const doubtSessions = await DoubtSession.find().populate(
      "student trainer batch"
    );
    res.status(200).json(doubtSessions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDoubtSessionById = async (req, res) => {
  try {
    const doubtSession = await DoubtSession.findById(req.params.id).populate(
      "student trainer batch"
    );
    if (!doubtSession) {
      return res.status(404).json({ message: "Doubt session not found" });
    }
    res.status(200).json(doubtSession);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateDoubtSession = async (req, res) => {
  try {
    const {
      doubt,
      sessionDate,
      sessionTime,
      timeZone,
      joinUrl,
    } = req.body;
    const updatedDoubtSession = await DoubtSession.findByIdAndUpdate(
      req.params.id,
      {
        doubt,
        sessionDate,
        sessionTime,
        timeZone,
        joinUrl,
      },
      { new: true }
    );
    if (!updatedDoubtSession) {
      return res.status(404).json({ message: "Doubt session not found" });
    }
    res.status(200).json(updatedDoubtSession);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteDoubtSession = async (req, res) => {
  try {
    const deletedDoubtSession = await DoubtSession.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDoubtSession) {
      return res.status(404).json({ message: "Doubt session not found" });
    }
    res.status(200).json({ message: "Doubt session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
