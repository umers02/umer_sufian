const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  next();
};

const validateVideoUpload = (req, res, next) => {
  const { title, description, genre, releaseYear } = req.body;
  
  if (!title || !description || !genre || !releaseYear) {
    return res.status(400).json({ message: 'Title, description, genre, and release year are required' });
  }
  
  next();
};

const validateCardDetails = (req, res, next) => {
  const { cardDetails } = req.body;
  
  if (!cardDetails) {
    return res.status(400).json({ message: 'Card details are required' });
  }
  
  const { cardNumber, cardHolderName, expiryMonth, expiryYear, cvv } = cardDetails;
  
  if (!cardNumber || !cardHolderName || !expiryMonth || !expiryYear || !cvv) {
    return res.status(400).json({ message: 'All card details are required' });
  }
  
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return res.status(400).json({ message: 'Invalid card number' });
  }
  
  if (cvv.length < 3 || cvv.length > 4) {
    return res.status(400).json({ message: 'Invalid CVV' });
  }
  
  next();
};

module.exports = { validateRegistration, validateLogin, validateVideoUpload, validateCardDetails };