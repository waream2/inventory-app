var express = require('express');
var router = express.Router();

var categoryController = require('../controllers/categoryController')
var productController = require('../controllers/productController');
const category = require('../models/category');


router.get('/', categoryController.category_list);

router.get('/new/', categoryController.add_category_get);

router.post('/new/', categoryController.add_category_post);

router.get('/product/all/', productController.product_list);

router.get('/:id/delete', categoryController.delete_category_get)

// router.post('delete/' categoryController.delete_category_post)

router.get('/:id', categoryController.category_list_inventory);



module.exports = router;
