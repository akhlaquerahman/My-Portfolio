const mongoose = require('mongoose');

const skillSetSchema = mongoose.Schema({
    // Skill category, e.g., 'Full Stack', 'AI/ML'. 
    // NOTE: 'unique' is deliberately excluded to allow multiple entries with the same category name.
    category: {
        type: String,
        required: true,
        enum: ['Full Stack', 'DevOps & Tools', 'Programming Languages', 'AI/ML', 'Soft Skills'],
        default: 'Full Stack'
    },
    // List of skills within that category, e.g., ['React', 'Node.js']
    skills: [ // Renamed from 'name'
        {
            name: { type: String, required: true },
            level: { type: Number, min: 0, max: 100, required: true },
        },
    ],
}, { 
    timestamps: true 
});

const SkillSet = mongoose.model('SkillSet', skillSetSchema);
module.exports = SkillSet;