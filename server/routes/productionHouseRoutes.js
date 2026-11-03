const express = require('express');
const router = express.Router();
const productionHouseController = require('../controllers/productionHouseController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');

// Public search and browsing
router.get('/', optionalAuthMiddleware, productionHouseController.getAll);
router.get('/:identifier', optionalAuthMiddleware, productionHouseController.getByIdentifier);

// Protected routes (studio creation & update)
router.post('/', authMiddleware, productionHouseController.create);
router.patch('/:id', authMiddleware, productionHouseController.update);

module.exports = router;
