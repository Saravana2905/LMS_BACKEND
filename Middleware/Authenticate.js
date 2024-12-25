const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user; // Save user information to request object
        next(); // Proceed to the next middleware or route handler
    });
};

verifyRole = (rolesArray) => (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: 'SESSION_EXPIRED',
      });
    }
    var authorized = false;
    //if user has a role that is required to access any API
  
    authorized = rolesArray.some(role => req.user.role === role);
    console.log( req.user.role,"------------->",rolesArray);
    if (authorized) {
      return next();
    }
    return res.status(403).json({
      status: 403,
      code: 'FORBIDDEN',
      message: "You don’t have permission to access this resource."
    })
  }

module.exports = {authenticateJWT, verifyRole};
