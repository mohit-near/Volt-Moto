const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
/* User Login API. */
router.post('/login', userController.login);

/* User Sign-up API */
router.post('/signup', userController.signup);

// Reset Password send Mail
router.post('/passwordreset', userController.sendResetMail);

// NOTE: Display reset password page link in "index.js".

// Route to change password when user submits on the rendered page.
router.post('/resetpwd', userController.resetPassword);

module.exports = router;
