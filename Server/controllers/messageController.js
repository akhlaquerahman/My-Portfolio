// Server/controllers/messageController.js

const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');
const { sendContactEmail } = require('../utils/emailService');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Create a new contact message
// @route   POST /api/messages (Public access)
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    // Validation
    if (!name || !normalizedEmail || !subject || !message) {
        res.status(400);
        throw new Error('Please fill all required fields: name, email, subject, and message.');
    }

    // Email format validation
    if (!emailRegex.test(normalizedEmail)) {
        res.status(400);
        throw new Error('Invalid email. Please enter a correct or valid email address.');
    }

    const newMessage = await ContactMessage.create({
        name: name.trim(),
        email: normalizedEmail,
        subject: subject.trim(),
        message: message.trim(),
        // isRead defaults to false (as defined in schema)
    });

    // Send email notification
    try {
        await sendContactEmail(name.trim(), normalizedEmail, subject.trim(), message.trim());
    } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the request if email fails, but log the error
    }

    // Send success response
    res.status(201).json({ 
        message: 'Message received successfully!',
        data: {
            _id: newMessage._id,
            name: newMessage.name
        }
    });
});

// @desc    Get all contact messages
// @route   GET /api/admin/messages
// @access  Private (Needs Auth in a real app)
const getMessages = asyncHandler(async (req, res) => {
    // ... existing code ...
    const messages = await ContactMessage.find({});
    res.json(messages);
});

// @desc    Update a message's read status
// ... existing code for updateMessageReadStatus ...
const updateMessageReadStatus = asyncHandler(async (req, res) => {
    // ... existing code ...
    const message = await ContactMessage.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
    );

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    res.json(message);
});

// @desc    Delete a message
// ... existing code for deleteMessage ...
const deleteMessage = asyncHandler(async (req, res) => {
    // ... existing code ...
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    res.json({ message: 'Message removed successfully' });
});

module.exports = {
    createMessage,
    getMessages,
    updateMessageReadStatus,
    deleteMessage
};
