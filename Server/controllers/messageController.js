// Server/controllers/messageController.js

const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');

// @desc    Create a new contact message
// @route   POST /api/messages (Public access)
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        res.status(400);
        throw new Error('Please fill all required fields: name, email, subject, and message.');
    }

    const newMessage = await ContactMessage.create({
        name,
        email,
        subject,
        message,
        // isRead defaults to false (as defined in schema)
    });

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
    // NEW: Export the createMessage function
    createMessage,
    getMessages,
    updateMessageReadStatus,
    deleteMessage
};