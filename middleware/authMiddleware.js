const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret
    req.user = decoded.userId; // Attach user ID to the request object (ensure the correct property in decoded token)
    next();
  } catch (error) {
    console.error('Error verifying token:', error); // Log the error
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
