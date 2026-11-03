const express = require('express');
const router = express.Router();
const savedHouseController = require('../controllers/savedHouseController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', savedHouseController.getSaved);
router.post('/toggle', savedHouseController.toggleSave);

module.exports = router;
