
// const express = require('express');
// const router = express.Router();
// const {getAllFiles,deleteFile} = require('../controllers/adminController');
// const { verifyToken, isAdmin,} = require('../middleware/authMiddleware');

// router.get('/files', verifyToken, isAdmin, getAllFiles);
// router.delete('/files/:id', verifyToken, isAdmin, deleteFile);
// module.exports = router;



const express = require('express');
const router = express.Router();
const {
  getAllFiles,
  deleteFile,
  getAllUsers,
  getInsightUsageLogs,
  getSystemAlerts,
  getUploadCounts,
  getUserSignupStats
} = require('../controllers/adminController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// 🗂️ File Management
router.get('/files', verifyToken, isAdmin, getAllFiles);
router.delete('/files/:id', verifyToken, isAdmin, deleteFile);

// 👥 User Management
router.get('/users', verifyToken, isAdmin, getAllUsers);
// router.patch('/users/:id/status', verifyToken, isAdmin, toggleUserStatus);

// 📊 Insight Logs
router.get('/insights/logs', verifyToken, isAdmin, getInsightUsageLogs);

// 🚨 System Alerts
router.get('/system/alerts', verifyToken, isAdmin, getSystemAlerts);

router.get('/users/upload-counts', verifyToken, isAdmin, getUploadCounts);


router.get('/users/stats', verifyToken, isAdmin, getUserSignupStats);

module.exports = router;
