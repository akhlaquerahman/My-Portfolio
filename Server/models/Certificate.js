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
        credentialURL: {
            type: String,
            required: [true, 'Please add the credential URL'],
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