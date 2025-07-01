require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve ALL static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Email setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Routes (keep exactly the same as before)
app.post('/api/contact', async (req, res) => {
    /* ... (keep your existing contact form code) ... */
});

app.post('/api/newsletter', async (req, res) => {
    /* ... (keep your existing newsletter code) ... */
});

// Handle all routes by sending index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});