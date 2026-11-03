const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', enquiryController.getEnquiries);
router.get('/:id', enquiryController.getById);
router.post('/', enquiryController.create);
router.patch('/:id/status', enquiryController.updateStatus);
router.post('/:id/messages', enquiryController.addMessage);

module.exports = router;
