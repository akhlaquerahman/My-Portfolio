const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a certificate title'],
        },
        issuer: {
            type: String,
            required: [true, 'Please add the issuer name'],
        },
        date: {
            type: String,
            required: [true, 'Please add the issue date'],
        },
        certificateUrl: {
            type: String,
            required: [true, 'Please add the certificate file'],
        },
        certificateFileId: {
            type: String,
            required: [true, 'Certificate file ID is required'],
        },
        fileName: {
            type: String,
            default: 'certificate.pdf',
        },
        mimeType: {
            type: String,
            required: [true, 'Certificate mime type is required'],
        },
        description: {
            type: String,
            required: false, // Description is optional
        },
    },
    {
        timestamps: true,
    }
);

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
