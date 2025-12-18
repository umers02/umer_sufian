const rateLimit = require('express-rate-limit');

const voteRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 votes per windowMs
  message: {
    success: false,
    message: 'Too many vote attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

module.exports = { voteRateLimit, apiRateLimit };