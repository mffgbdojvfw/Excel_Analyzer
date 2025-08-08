// const express = require('express');
// const router = express.Router();
// const { register, login,adminLogin , updateAdminCredentials } = require('../controllers/authController');
// router.post('/register', register);
// router.post('/login', login);
// router.post('/admin-login', adminLogin);
// router.patch('/admin/update-credentials', updateAdminCredentials);
// module.exports = router;



const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  register,
  login,
  adminLogin,
  updateAdminCredentials,
  updateProfileImage,
  deleteProfileImage
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profile'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.patch('/admin/update-credentials', verifyToken, updateAdminCredentials);

// ✅ New profile image route
router.patch('/update-profile-image', verifyToken, upload.single('image'), updateProfileImage);

router.delete('/delete-profile', verifyToken, deleteProfileImage);

module.exports = router;
