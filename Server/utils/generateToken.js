const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // Ye secret key aapke .env file mein honi chahiye, jaise ki JWT_SECRET="your_very_secret_key"
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        // Token kitne samay tak valid rahega (e.g., 30 days)
        expiresIn: '30d', 
    });
};

module.exports = generateToken;