const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const validateUsername = require('../middlewares/validateUsername');

// 1. Analyze profile route: validates username in body, then processes & upserts profile
router.post('/analyze', validateUsername, profileController.analyzeProfile);

// NEW route — analyze via URL param (no body needed)
router.get('/analyze/:username', profileController.analyzeProfile);

// 2. Get all profiles route: supports search, sorting, and pagination/limit
router.get('/', profileController.getAllProfiles);

// 3. Get single profile route: retrieves profile details by username (case-insensitive)
router.get('/:username', profileController.getProfile);

// 4. Delete profile route: removes a profile by username (case-insensitive)
router.delete('/:username', profileController.deleteProfile);

module.exports = router;

