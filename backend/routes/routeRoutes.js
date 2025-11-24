const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// @route   GET /api/routes/find
// @desc    Find routes between two stops
// @access  Public
router.get('/find', routeController.findRoutes);

// @route   GET /api/routes/stops
// @desc    Get all stops with their route connectivity
// @access  Public
router.get('/stops', routeController.getAllStopsWithRoutes);

module.exports = router;
