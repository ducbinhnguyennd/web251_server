const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');
const multer = require('multer');
const { route, render } = require('..');
const storage = multer.memoryStorage();
const uploader = multer({ storage: storage });




router.get('/', homeController.home);
router.post('/', homeController.home);

router.get('/search', homeController.searchByName);

// SẢN PHẨM
router.get('/add', homeController.add);
router.post('/add', uploader.single('image'), homeController.add);

router.get('/home/edit/:idsp', homeController.edit);
router.post('/home/edit/:idsp', uploader.single('image'), homeController.edit);


router.get('/home/deleteSP/:idsp', homeController.deleteSP);
router.post('/home/deleteSP/:idsp', homeController.deleteSP);


// BLOG
router.get('/addblog', homeController.addblog);
router.post('/addblog', uploader.single('image'), homeController.addblog);


router.get('/home/editBlog/:idblog', homeController.editBlog);
router.post('/home/editBlog/:idblog', uploader.single('image'), homeController.editBlog);


router.get('/home/deleteBlog/:idblog', homeController.deleteBlog);
router.post('/home/deleteBlog/:idblog', homeController.deleteBlog);

//
router.get('/chitietblog/:idblog', homeController.chitietblog);
router.post('/chitietblog/:idblog', homeController.chitietblog);

router.get('/shop/', homeController.shop);
router.get('/contact/', homeController.contact);
router.get('/thanhtoan/', homeController.thanhtoan);



router.get('/chitiet/:idsp', homeController.chitiet);
router.post('/chitiet/:idsp', homeController.chitiet);
router.get('/main/', homeController.main);
module.exports = router;
