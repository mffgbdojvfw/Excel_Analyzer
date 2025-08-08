const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require("./connection/connection")
require('dotenv').config();

const PORT = process.env.PORT || 5000;


const app = express();

connectDB();

// // Middleware
// app.use(cors());


app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve uploaded files statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const insightRoutes = require('./routes/insightRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/insights', insightRoutes);
// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });


app.listen(PORT,()=>{
    console.log("server is linstening")
    console.log("Gemini Key:", process.env.GEMINI_API_KEY);
})

const bcrypt = require('bcryptjs');
bcrypt.hash('123456', 10).then(console.log);
