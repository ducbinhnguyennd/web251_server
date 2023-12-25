var express = require('express');
var router = express.Router();
var settingsController = require('../controllers/user/settings.controller');



router.get('/', settingsController.register);
router.post('/', settingsController.register);

router.get('/login', settingsController.login);
router.post('/login', settingsController.login);

module.exports = router;