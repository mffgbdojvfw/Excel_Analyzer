const express = require('express');
const router = express.Router();
const path = require("path")
const File = require("../models/File")
const fs = require("fs")
const upload = require('../middleware/uploadMiddleware');
const { uploadExcel,getUserFiles,getParsedExcelData,getBase64FileById, deleteOwnFile } = require('../controllers/uploadController');
const { verifyToken } = require('../middleware/authMiddleware');

// KEY LINE: 'file' must match field name in Postman
router.post('/excel',verifyToken, upload.single('file'), uploadExcel);
router.get('/history', verifyToken, getUserFiles);
router.get('/:id/data', verifyToken, getParsedExcelData);

router.get('/download/:id', verifyToken, async (req, res) => {
  try {
    console.log('Download request for ID:', req.params.id);

    const file = await File.findById(req.params.id);
    if (!file) {
      console.log('❌ File not found in DB');
      return res.status(404).json({ message: 'File not found' });
    }

    console.log('✅ File found in DB:', file);

    const filePath = path.join(__dirname, '../uploads', file.filename);
    console.log('Resolved file path:', filePath);

    if (!fs.existsSync(filePath)) {
      console.log('❌ File does not exist on disk');
      return res.status(404).json({ message: 'File not found on disk' });
    }

    return res.download(filePath, file.originalName || file.filename);
  } catch (err) {
    console.error('❌ Download error:', err);
    res.status(500).json({ message: 'Server error during download' });
  }
});


router.get('/:id/base64', verifyToken, getBase64FileById);

router.delete('/history/:id', verifyToken, deleteOwnFile);

module.exports = router;

