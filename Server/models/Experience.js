const mongoose = require('mongoose');

const experienceSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a job title'],
        },
        company: {
            type: String,
            required: [true, 'Please add a company name'],
        },
        startDate: {
            type: String,
            required: [true, 'Please add a start date'],
        },
        endDate: {
            type: String,
            required: [true, 'Please add an end date'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description of your role'],
        },
    },
    {
        timestamps: true,
    }
);

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;