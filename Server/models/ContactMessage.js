// New Model for storing contact messages
const mongoose = require('mongoose');
const contactMessageSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('ContactMessage', contactMessageSchema);