const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');
const multer = require('multer');
const { route, render } = require('..');
const uploader = multer({ dest: '../tmp' });


router.get('/home', homeController.home);   
router.post('/home', homeController.home);

router.get('/search', homeController.searchByName);


router.get('/add', homeController.add);
router.post('/add', uploader.single('file_anh'), homeController.add);
router.post('/add2', homeController.addJson);

router.get('/home/edit/:idsp', homeController.edit);
router.post('/home/edit/:idsp', uploader.single('file_anh'), homeController.edit);
router.put('/home/edit2/:idsp', homeController.editJson);


router.get('/home/deleteSP/:idsp', homeController.deleteSP);
router.post('/home/deleteSP/:idsp', homeController.deleteSP);
router.delete('/home/delete2/:idsp', homeController.deleteJson);

router.get('/shop/', homeController.shop);

router.get('/chitiet/:idsp', homeController.chitiet);
router.post('/chitiet/:idsp', homeController.chitiet);
router.get('/main/', homeController.main);
module.exports = router;
