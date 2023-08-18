const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const upload = require('../utility/uploads')

const router = express.Router();

router.get('/users', authController.protect, authController.isAdmin, userController.getUsers);
router.patch('/users/add-photo', authController.protect, upload.single('photo'), userController.updatePhoto);
router.post('/addUser',  authController.protect, authController.isAdmin, userController.generateUuid,  upload.single('photo'), userController.addUser);
router.get('/users-details', authController.protect, userController.userDetails);

module.exports = router;