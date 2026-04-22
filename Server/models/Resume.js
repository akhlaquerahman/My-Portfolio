const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema(
  {
    resumeUrl: {
      type: String,
      required: true
    },
    resumeFileId: {
      type: String, // Storage provider file id for deletion
      required: true
    },
    fileName: {
      type: String,
      default: 'resume.pdf'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
