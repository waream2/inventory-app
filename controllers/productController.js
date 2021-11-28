/* eslint-disable consistent-return */
const async = require('async');
const { body, validationResult } = require('express-validator');
const Product = require('../models/product');
const Category = require('../models/category');

// see all products
exports.product_list = function (req, res, next) {
	Product.find({})
		.populate('category')
		.exec((err, inventory) => {
			if (err) { return next(err); }
			res.render('products_view', { title: 'View Full Inventory', inventory });
		});
};

exports.product_view = function (req, res, next) {
	Product.findById(req.params.id)
		.populate('category')
		.exec((err, product) => {
			if (err) { return next(err); }
			res.render('product_view', { title: product.name, product });
		});
};

exports.product_delete_get = function (req, res) {
	res.render('product_delete', { title: 'Delete Product', productid: req.params.id });
};

exports.product_delete_post = function (req, res, next) {
	Product.findByIdAndRemove(req.body.productid, (err) => {
		if (err) { return next(err); }
		// Success - go to author list
		res.redirect('/category/product/all/');
	});
};

exports.product_add_get = function (req, res, next) {
	Category.find({})
		.exec((err, categories) => {
			if (err) { return next(err); }
			res.render('product_add', { categories, id: req.params.id });
		});
};

exports.product_add_post = [
	body('name').isLength({ min: 1, max: 100 }).escape().withMessage('You must enter a valid category'),
	body('description').isLength({ min: 5 }).escape().trim()
		.withMessage('You must enter a valid description'),
	body('category', 'You must select a category').escape().trim(),
	body('price').escape().trim(),
	body('inStock').escape().trim(),

	function (req, res, next) {
		const {
			name, description, category, price,
		} = req.body;

		let { inStock } = req.body;

		if (inStock === 'on') {
			inStock = true;
		} else inStock = false;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			Category.find({})
				.exec((err, categories) => {
					res.render('product_add', {
						title: 'add product', categories, product: req.body, errors: errors.array(),
					});
				});
		} else {
			const product = new Product(
				{
					name,
					description,
					category,
					price,
					inStock,
				},
			);
			product.save((err) => {
				if (err) { return next(err); }
				res.redirect(product.url);
			});
		}
	},
];

exports.product_update_get = function (req, res, next) {
	async.parallel({
		product(callback) {
			Product.findById(req.params.id)
				.populate('category')
				.exec(callback);
		},
		categories(callback) {
			Category.find({})
				.exec(callback);
		},

	}, (err, results) => {
		if (err) { return next(err); }
		res.render('product_add', {

			title: 'Update Product', product: results.product, categories: results.categories,
		});
		console.log(typeof (results.product));
	});
};

exports.product_update_post = [
	body('name').isLength({ min: 1, max: 100 }).escape().withMessage('You must enter a valid category'),
	body('description').isLength({ min: 5 }).escape().trim()
		.withMessage('You must enter a valid description'),
	body('category', 'You must select a category').escape().trim(),
	body('price').escape().trim(),
	body('inStock').escape().trim(),

	function (req, res, next) {
		const {
			name, description, category, price,
		} = req.body;

		let { inStock } = req.body;

		if (inStock === 'on') {
			inStock = true;
		} else inStock = false;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			Category.find({})
				.exec((err, categories) => {
					res.render('product_add', {
						title: 'add product', categories, product: req.body, errors: errors.array(),
					});
				});
		} else {
			const product = new Product(
				{
					name,
					description,
					category,
					price,
					inStock,
					_id: req.params.id,
				},
			);
			Product.findByIdAndUpdate(req.params.id, product, {}, (err, product) => {
				if (err) { return next(err); }
				res.redirect(product.url);
			});
		}
	},
];
