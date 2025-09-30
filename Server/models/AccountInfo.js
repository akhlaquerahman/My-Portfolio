const mongoose = require('mongoose');

const accountInfoSchema = mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      default: 'Akhlaque Rahman',
    },
    // User's email address
    email: {
      type: String,
      required: true,
      unique: true,
      default: 'akhlaquerahman18@gmail.com',
    },
    // User's phone number
    phone: {
      type: String,
      default: '+91 9631901329',
    },
    // 💡 NEW FIELDS FOR PROFILE IMAGE
    profileImageUrl: {
        type: String
    },
    profileImageId: {
        type: String, // Public ID to delete the image from Cloudinary later
    },
    // Main summary or bio for the About section
    summary: {
      type: String,
      default: 'I am a Computer Science undergraduate with a strong background in Full Stack Web Development...',
    },
    //
    about: {
      type: String,
      default: 'I am a Computer Science undergraduate with a strong background in Full Stack Web Development...',
    },
    experience: {
        type: Number,
        required: false
    },
    project: {
        type: Number,
        required: false
    },
    hackathon: {
        type: Number,
        required: false
    },
    certificate: {
        type: Number,
        required: false
    },
    award: {
        type: Number,
        required: false
    },
    technology: {
        type: Number,
        required: false
    },
  },
  {
    timestamps: true,
  }
);

const AccountInfo = mongoose.model('AccountInfo', accountInfoSchema);
module.exports = AccountInfo;