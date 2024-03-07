const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env?.USER_EMAIL, // Your Gmail email address
        pass: process.env?.EMAIL_PASS_KEY // Your Gmail password
    }
});

app.get("/",(req,res)=>{
    res.status(200).message("hello")
})
// Route to handle sending emails
app.post('/send-email', (req, res) => {
            // body: JSON.stringify({ name, email, message ,phone})
            const { name, email, message, phone } = req.body;

    // Email message
    const mailOptions = {
        from: process.env?.USER_EMAIL,
        to: process.env?.USER_EMAIL,
        subject: 'New message from contact form',
        text: `Name: ${name}\nEmail: ${email}\nPhone Number:${phone}\nMessage: ${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
