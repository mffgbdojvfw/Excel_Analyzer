

// const jwt = require('jsonwebtoken');

// // Middleware to verify token
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // attaches id and role
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Middleware to check if user is admin
// const isAdmin = (req, res, next) => {
//   if (req.user?.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied: Admins only' });
//   }
//   next();
// };

// module.exports = { verifyToken, isAdmin };





const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;      // includes userId, role
    req.token = token;       // ✅ needed for image update
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
