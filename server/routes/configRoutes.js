const express = require('express');
const {
  getConfig,
  updateConfig
} = require('../controllers/configController');

const router = express.Router();

// GET /api/config - Get configuration
router.get('/', getConfig);

// POST /api/config - Update configuration
router.post('/', updateConfig);

module.exports = router;