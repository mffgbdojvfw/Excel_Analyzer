// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const ADMIN_EMAIL  = process.env.ADMIN_EMAIL;
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';



// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;
//   const role = 'user';

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: 'Email is already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ Create user with lastLogin set to now
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       lastLogin: new Date(), // ✅ set lastLogin on registration
//     });

//     await newUser.save();

//     const token = jwt.sign(
//       { userId: newUser._id, role: newUser.role },
//       JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     return res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//         lastLogin: newUser.lastLogin, // ✅ optional: include this in response
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };


// // Login Controller
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ message: 'Email and password are required' });

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(401).json({ message: 'Invalid email or password' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: 'Invalid email or password' });

//     // ✅ Set lastLogin timestamp
//     user.lastLogin = new Date();
//     await user.save();

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '1d' }
//     );
//     console.log("Login response user:", user);
//     return res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         lastLogin: user.lastLogin, // Optional
//       },
//     }); 
//   } catch (err) {
//     return res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };



// exports.adminLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email: email.trim().toLowerCase() });
//     if (!user || user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied: Not an admin' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // ✅ Update lastLogin
//     user.lastLogin = new Date();
//     await user.save();

//     const token = jwt.sign({ userId: user._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

//     res.json({
//       message: 'Admin logged in successfully',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         lastLogin: user.lastLogin,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };




// exports.updateAdminCredentials = async (req, res) => {
//   const { newEmail, newPassword } = req.body;
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.userId);

//     if (!user || decoded.role !== 'admin') {
//       return res.status(403).json({ message: 'Only admin can update credentials' });
//     }

//     if (newEmail) user.email = newEmail;
//     if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

//     await user.save();

//     res.json({ message: '✅ Admin credentials updated successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update credentials', error: err.message });
//   }
// };



// // PATCH /api/auth/update-profile-image
// exports.updateProfileImage = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

//     user.profileImage = `/uploads/profile/${req.file.filename}`;
//     await user.save();

//     res.json({
//       message: '✅ Profile image updated',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         profileImage: user.profileImage,
//         lastLogin: user.lastLogin,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to upload image', error: err.message });
//   }
// };




const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// =================== REGISTER ===================
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const role = 'user';

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      lastLogin: new Date(),
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage || null, // ✅ Include image
        lastLogin: newUser.lastLogin,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =================== LOGIN ===================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || null, // ✅ Include image
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =================== ADMIN LOGIN ===================
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Not an admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id, role: 'admin' }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      message: 'Admin logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || null, // ✅ Include image
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =================== UPDATE ADMIN EMAIL/PASSWORD ===================
exports.updateAdminCredentials = async (req, res) => {
  const { newEmail, newPassword } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can update credentials' });
    }

    if (newEmail) user.email = newEmail;
    if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({ message: '✅ Admin credentials updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update credentials', error: err.message });
  }
};

// =================== UPDATE PROFILE IMAGE ===================
exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    user.profileImage = `/uploads/profile/${req.file.filename}`;
    await user.save();

    res.json({
      message: '✅ Profile image updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload image', error: err.message });
  }
};


exports.deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ fixed this line

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profileImage = null; // Or: '/default-avatar.png'
    await user.save();

    res.json({
      message: '✅ Profile image deleted',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

