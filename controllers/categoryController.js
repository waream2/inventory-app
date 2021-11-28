/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const async = require('async');
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Product = require('../models/product');

// see all categories
exports.category_list = function (req, res, next) {
	Category.find({})
		.exec((err, list_categories) => {
			if (err) { return next(err); }

			res.render('category_view', { title: 'Inventory Categories', category_list: list_categories });
		});
};

// see inventory for category
exports.category_list_inventory = function (req, res, next) {
	async.parallel({
		category(callback) {
			Category.findById(req.params.id)
				.exec(callback);
		},
		products(callback) {
			Product.find({ category: req.params.id })
				.populate('category')
				.exec(callback);
		},
	}, (err, results) => {
		if (err) { return next(err); } // Error in API usage.
		if (results.category == null) { // No results.
			const err = new Error('Category not found');
			err.status = 404;
			return next(err);
		}
		res.render('category_inventory', { title: 'Current Inventory', category: results.category, inventory: results.products });
		// console.log(req.params.id)
	});
};

// add a category - get, so this gives you a tempalte with the form needed
exports.add_category_get = function (req, res) {
	res.render('category_add', { title: 'Create Category', subHead: 'This should not be used often as there aren\'t many more categories' });
};

// add a category - post, so this submits the car to the database
exports.add_category_post = [
	body('name').isLength({ min: 1, max: 100 }).escape().withMessage('You must enter a valid category'),
	body('description').escape().trim(),

	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render('category_add', {
				title: 'Create Category', subHead: 'This should not be used often as there aren\'t many more categories', category: req.body, errors: errors.array(),
			});
		} else {
			// Data from form is valid.
			// Create an Category object with escaped and trimmed data.
			const category = new Category(
				{
					name: req.body.name,
					description: req.body.description,
				},
			);
			category.save((err) => {
				if (err) { return next(err); }
				// Successful - redirect to new category record.
				res.redirect(category.url);
			});
		}
	},
];

exports.delete_category_get = function (req, res, next) {
	async.parallel({
		category(callback) {
			Category.findById(req.params.id)
				.exec(callback);
		},
		products(callback) {
			Product.find({ category: req.params.id })
				.exec(callback);
		},
	}, (err, results) => {
		if (err) { return next(err); }
		if (results.category == null) { // No results.
			res.redirect('/category/');
		}
		// Successful, so render.
		res.render('category_delete', { title: 'Delete Category', category: results.category, category_products: results.products });
	});
};

exports.delete_category_post = function (req, res, next) {
	async.parallel({
		category(callback) {
			Category.findById(req.params.id)
				.exec(callback);
		},
		products(callback) {
			Product.find({ category: req.params.id })
				.exec(callback);
		},
	}, (err, results) => {
		if (err) { return next(err); }
		// Success
		if (results.products.length > 0) {
			// Category has products. Render in same way as for GET route.
			res.render('category_delete', { title: 'Delete Category', category: results.category, category_products: results.products });
		} else {
			// category has no books. Delete object and redirect to the list of categories.
			Category.findByIdAndRemove(req.body.categoryid, (err) => {
				// console.log(req.body)
				if (err) { return next(err); }
				// Success - go to category list
				res.redirect('/category/');
			});
		}
	});
};

exports.update_category_get = function (req, res, next) {
	Category.findById(req.params.id)
		.exec((err, category) => {
			if (err) { return next(err); }
			res.render('category_add', { title: 'Update Category', subHead: 'Use this form to update this category\'s name or description', category });
		});
};

exports.update_category_post = [
	body('name').isLength({ min: 1, max: 100 }).escape().withMessage('You must enter a valid category'),
	body('description').escape().trim(),

	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render('category_add', {
				title: 'Update Category', subHead: 'Update This Category', category: req.body, errors: errors.array(),
			});
		} else {
			// Data from form is valid.
			// Create an Category object with escaped and trimmed data.
			const category = new Category(
				{
					name: req.body.name,
					description: req.body.description,
					_id: req.params.id,
				},
			);
			Category.findByIdAndUpdate(req.params.id, category, { message: 'This was updated' }, (err, category) => {
				if (err) { return next(err); }
				// Successful - redirect to book detail page.
				res.redirect(category.url);
			});
		}
	},
];
