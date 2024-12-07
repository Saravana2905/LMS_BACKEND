const express = require('express');
const app = express();
const mongoose = require('mongoose');
const courseRoutes = require('./Routes/courseRoute');
const trainerRoutes = require('./Routes/trainerRoute');
const cors = require('cors');
require('dotenv').config();

const corsOptions = {
    origin: '*', // Replace with your allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/courses', courseRoutes);
app.use('/trainer', trainerRoutes);

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