const express = require('express');
const configController = require('../controllers/configController');

const router = express.Router();

// Configuration routes
router.get('/', configController.getConfig);
router.post('/', configController.updateConfig);

// Criteria routes
router.get('/criteria', configController.getCriteria);
router.post('/criteria', configController.addCriteria);
router.delete('/criteria', configController.removeCriteria);

module.exports = router;
