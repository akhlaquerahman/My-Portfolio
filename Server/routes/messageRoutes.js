// Server/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { 
    createMessage,
    getMessages, 
    updateMessageReadStatus, 
    deleteMessage 
} = require('../controllers/messageController');

// Public route for form submission
router.route('/')
    .get(getMessages) 
    .post(createMessage);

// Specific message (PUT to toggle read status, DELETE)
router.route('/:id')
    .put(updateMessageReadStatus) 
    .delete(deleteMessage);

module.exports = router;
