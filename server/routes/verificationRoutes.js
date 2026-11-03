const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');

router.get('/:productionHouseId', optionalAuthMiddleware, verificationController.getStatus);
router.post('/submit', authMiddleware, verificationController.submitVerification);

module.exports = router;
