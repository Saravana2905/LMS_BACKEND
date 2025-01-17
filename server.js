const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const courseRoutes = require('./Routes/courseRoute');
const trainerRoutes = require('./Routes/trainerRoute');
const studentRoutes = require('./Routes/studentRoute');
const adminRoutes = require('./Routes/adminRoute')
const meetingRoutes = require('./Routes/meetingRoute');
const webinarRoutes = require('./Routes/webinarRoute');
const batchRoutes = require('./Routes/batchRoute')
const projectRoutes = require('./Routes/projectRoute');
const testRoutes = require('./Routes/testRoute');
const doubtSessionRoutes = require('./Routes/doubtSessionRoute');
const technicalSupportRoutes = require('./Routes/technicalSupportRoute');
const trainerAvailableTimeRoutes = require('./Routes/traineravailabletimeRoute'); 
const webinarRegisterRoutes = require('./Routes/webinarRegisterRoute');  
const loginRoutes = require('./Routes/loginRoute');
const cashfreeRoutes = require('./Routes/cashfreeRoute')
const cors = require('cors');
require('dotenv').config();

const corsOptions = {
    origin: '*', // Specify your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('',loginRoutes)
app.use('/courses', courseRoutes);
app.use('/trainer', trainerRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes)
app.use('/meeting', meetingRoutes);
app.use('/webinar', webinarRoutes);
app.use('/batch', batchRoutes);
app.use('/project', projectRoutes);
app.use('/test', testRoutes);
app.use('/doubtSession', doubtSessionRoutes);
app.use('/technicalSupport', technicalSupportRoutes)
app.use('/files', express.static(path.join(__dirname, '..', '..', '..', 'uploads')));
app.use('/trainerAvailableTime', trainerAvailableTimeRoutes);
app.use('/webinarRegister', webinarRegisterRoutes)
app.use('/cashfree', cashfreeRoutes)

//test route
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });