const mongoose = require('mongoose');

const portfolioItemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: { // Stores the full URL returned by Cloudinary
      type: String,
      required: true,
    },
    githubUrl: {
      type: String,
      required: true,
    },
    liveUrl: {
      type: String,
    },
    // New field to categorize projects for the dashboard
    category: {
        type: String,
        required: true,
        enum: ['Full Stack', 'Frontend', 'Backend', 'AI/ML'], // Example categories
        default: 'Full Stack'
    },
    featured: {
        type: Boolean,
        enum: [true, false],
        default: false // Default to not featured
    },
  },
  {
    timestamps: true,
  }
);

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);
module.exports = PortfolioItem;