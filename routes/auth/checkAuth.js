const express = require('express');
const router = express.Router();
const { checkAuthService } = require("../../services/auth/checkAuth")

router.get('/', checkAuthService);

module.exports = router;