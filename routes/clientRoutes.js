const express = require('express');
const clientsController = require('../controllers/clientsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.protect,clientsController.getClients);
router.post('/add-client', authController.protect, authController.isAdmin ,clientsController.addClients);

module.exports = router;
