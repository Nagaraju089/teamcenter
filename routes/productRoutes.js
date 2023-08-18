const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController');
const authController = require('../controllers/authController');

router.get('/', authController.protect ,productController.getAllProducts);
router.get('/:client_id', authController.protect, productController.getProductsByClient);
router.post('/:clientId/add-product', authController.protect, authController.isAdmin, productController.assignProductToClient);


module.exports = router;
