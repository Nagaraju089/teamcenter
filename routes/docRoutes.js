
const express = require('express');
const router = express.Router();
const upload = require('../utility/uploads')
const docController = require('../controllers/docController');
const authController = require('../controllers/authController');


router.post('/:clientId/:productId/upload-docs', authController.protect ,upload.single('file'), docController.uploadDocs);
router.get('/:clientId/:productId', authController.protect, docController.getDocuments);
router.get('/recents', authController.protect, docController.recentFiles);
router.get('/docs/:docID/download', docController.downloadFiles);


module.exports = router;
