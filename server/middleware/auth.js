const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken library

module.exports = function (req, res, next) {
  // Extracting the authorization header from the request
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Checking if the authorization header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' }); // Respond with 401 if no token
  }

  // Extracting the token from the authorization header
  const token = authHeader.split(' ')[1];

  try {
    // Verifying the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach user ID to the request object for route access
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('[AUTH ERROR]', err.message); // Log the error message
    return res.status(401).json({ message: 'Invalid or expired token.' }); // Respond with 401 if token is invalid or expired
  }
};
