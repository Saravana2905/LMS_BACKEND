const express = require('express');
const app = express();
const mongoose = require('mongoose');
const courseRoutes = require('./Routes/courseRoute');
const trainerRoutes = require('./Routes/trainerRoute');
const studentRoutes = require('./Routes/studentRoute');
const meetingRoutes = require('./Routes/meetingRoute');
const webinarRoutes = require('./Routes/webinarRoute');
const mailRoutes = require('./Routes/mailRoutes');
const paypalRoutes = require('./Routes/paypalRoute');
const batchRoutes = require('./Routes/batchRoute')
const projectRoutes = require('./Routes/projectRoute');
const testRoutes = require('./Routes/testRoute');
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

app.use('/courses', courseRoutes);
app.use('/trainer', trainerRoutes);
app.use('/student', studentRoutes);
app.use('/meeting', meetingRoutes);
app.use('/webinar', webinarRoutes);
app.use('/mail', mailRoutes);
app.use('/paypal', paypalRoutes);
app.use('/batch', batchRoutes);
app.use('/project', projectRoutes);
app.use('/test', testRoutes);

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