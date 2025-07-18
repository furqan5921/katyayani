require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Connect to database
connectDB();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("API is running...");
});

// Define Routes
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/colleges', require('./routes/collegeRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});