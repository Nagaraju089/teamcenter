const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/send', authController.sendOTP);
router.post('/verify', authController.verifyOTP);
router.post('/resend',authController.resendOtp )
router.get('/logout', authController.logout);

module.exports = router;
