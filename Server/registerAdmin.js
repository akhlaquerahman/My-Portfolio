// File: Server/registerAdmin.js (Use this one-time script)
const connectDB = require('./config/db');
const User = require('./models/User'); 
require('dotenv').config(); 

// Ye zaroori hai agar aap Mongoose ke models ko use kar rahe hain
require('./models/User'); 

connectDB();

const registerUser = async () => {
    try {
        // Check if admin already exists
        const existingUser = await User.findOne({ email: "akhlaquerahman@18gmail.com" });
        if (existingUser) {
            console.log('Admin user already exists. Skipping creation.');
            process.exit();
        }

        console.log('Creating Admin User...');

        const adminUser = await User.create({
            name: "Akhlaque Rahman",
            email: "akhlaquerahman@18gmail.com",
            password: "Akhlaque@123", // Password will be hashed by the model pre-save middleware
            isAdmin: true,
        });

        console.log(`✅ Admin user created successfully: ${adminUser.email}`);
        process.exit();
    } catch (error) {
        console.error(`❌ Error creating user: ${error.message}`);
        process.exit(1);
    }
};

registerUser();