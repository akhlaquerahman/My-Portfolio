// Server/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { 
    // NEW: Import the createMessage function
    createMessage,
    getMessages, 
    updateMessageReadStatus, 
    deleteMessage 
} = require('../controllers/messageController');

// Public route for form submission
router.route('/')
    .get(getMessages) 
    .post(createMessage); // <-- NEW: Use POST for creating a new message

// Specific message (PUT to toggle read status, DELETE)
router.route('/:id')
    .put(updateMessageReadStatus) 
    .delete(deleteMessage);

module.exports = router;