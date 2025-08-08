const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { generateInsight } = require('../controllers/insightController');

router.post('/:id', verifyToken, generateInsight);

module.exports = router;
