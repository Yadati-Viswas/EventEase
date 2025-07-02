const rateLimiters = require('express-rate-limit');

exports.loginLimiter = rateLimiters({
    windowMs: 60 * 1000,
    max: 5, 
    handler: (req, res, next) => {
        return res.status(429).json({
            success: false,
            message: 'Too many Login requests, please try again after 15 minutes',
        });
    }
});