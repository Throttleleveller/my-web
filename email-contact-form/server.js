const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files
app.use(express.static('public'));

// Check if required environment variables are set
const requiredEnvVars = ['EMAIL_SERVICE', 'EMAIL_USER', 'EMAIL_PASS', 'RECIPIENT_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please check your .env file and ensure all required variables are set.');
} else {
  console.log('All required environment variables are set.');
}

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific handling logic here
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  console.log('Received email request:', { 
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    // Not logging the full message for privacy
    messageLength: req.body.message ? req.body.message.length : 0
  });
  
  const { name, email, subject, message } = req.body;
  
  // Validate input
  if (!name || !email || !subject || !message) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('Validation failed: Invalid email format');
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }
  
  try {
    console.log('Creating email transporter...');
    // Create a transporter with detailed logging
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true, // Enable debug logs
      logger: true  // Log to console
    });
    
    console.log('Verifying transporter connection...');
    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('Server is ready to take our messages');
    } catch (verifyError) {
      console.error('Transporter verification failed:', verifyError);
      return res.status(500).json({ 
        success: false, 
        message: 'Email server connection failed',
        error: verifyError.message
      });
    }
    
    console.log('Preparing email options...');
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      replyTo: email, // Set reply-to as the form submitter's email
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };
    
    console.log('Sending email...');
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to send email';
    let errorDetails = {};
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Please check your email credentials.';
      errorDetails.authError = true;
    } else if (error.code === 'ESOCKET') {
      errorMessage = 'Network error when connecting to mail server.';
      errorDetails.networkError = true;
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: error.message,
      details: errorDetails
    });
  }
});

// Basic route for testing if server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'production' ? null : err.message 
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email service: ${process.env.EMAIL_SERVICE}`);
  console.log(`Email user: ${process.env.EMAIL_USER}`);
  console.log(`Recipient email: ${process.env.RECIPIENT_EMAIL}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});
