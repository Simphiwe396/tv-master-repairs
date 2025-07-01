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
app.use(express.static(path.join(__dirname, '../public')));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Routes
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // Send email to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting TV Master & Repairs',
            html: `
                <h3>Thank you for your message!</h3>
                <p>We have received your inquiry and will get back to you within 24 hours.</p>
                <p>Your message:</p>
                <p>${message}</p>
                <br>
                <p>Best regards,</p>
                <p>The TV Master & Repairs Team</p>
            `
        };
        
        await transporter.sendMail(userMailOptions);
        
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
});

app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Send email to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Newsletter Subscription',
            html: `
                <h3>New Newsletter Subscription</h3>
                <p><strong>Email:</strong> ${email}</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thanks for subscribing to our newsletter',
            html: `
                <h3>Thank you for subscribing!</h3>
                <p>You'll now receive updates about our latest services and promotions.</p>
                <br>
                <p>Best regards,</p>
                <p>The TV Master & Repairs Team</p>
            `
        };
        
        await transporter.sendMail(userMailOptions);
        
        res.json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ success: false, message: 'Error subscribing' });
    }
});

// Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});