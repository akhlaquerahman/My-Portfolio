// New Model for storing contact messages
const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactMessageSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => emailRegex.test(value),
            message: 'Please enter a valid email address.',
        },
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('ContactMessage', contactMessageSchema);
