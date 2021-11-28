const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');

router.get('/', categoryController.category_list);

router.get('/new/', categoryController.add_category_get);

router.post('/new/', categoryController.add_category_post);

router.get('/product/all/', productController.product_list);

router.get('/product/add', productController.product_add_get);

router.get('/:id/delete/', categoryController.delete_category_get);

router.post('/:id/delete/', categoryController.delete_category_post);

router.get('/:id/update/', categoryController.update_category_get);

router.post('/:id/update/', categoryController.update_category_post);

router.get('/product/:id/', productController.product_view);

router.get('/product/:id/delete', productController.product_delete_get);

router.post('/product/:id/delete', productController.product_delete_post);

router.post('/product/add', productController.product_add_post);

router.get('/product/:id/update', productController.product_update_get);

router.post('/product/:id/update', productController.product_update_post);

router.get('/:id', categoryController.category_list_inventory);

module.exports = router;
