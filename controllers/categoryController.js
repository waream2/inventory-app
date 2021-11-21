var mongoose = require('mongoose');
let Category = require('../models/category')
let Product = require('../models/product')
var async = require('async');
const { body, validationResult } = require('express-validator');

// see all categories
exports.category_list = function(req, res, next) {
  Category.find({})
  .exec(function (err, list_categories) {
    if (err) { return next(err); }

    res.render('categories_view', { title: 'Inventory Categories', category_list: list_categories });
});

}

// see inventory for category
exports.category_list_inventory = function (req, res, next) {
  async.parallel({
    category: function (callback) {
        Category.findById(req.params.id)
            .exec(callback)
    },
    products: function (callback) {
        Product.find({ category: req.params.id })
        .populate('category')
            .exec(callback)
    },
}, function (err, results) {
    if (err) { return next(err); } // Error in API usage.
    if (results.category == null) { // No results.
        var err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }
    res.render('category_inventory', { title: 'Current Inventory', category: results.category, inventory: results.products})
  // console.log(req.params.id)

  })
}

// add a category - get, so this gives you a tempalte with the form needed
exports.add_category_get = function (req, res, next) {
  res.render('categories_add')
}

// add a category - post, so this submits the car to the database
exports.add_category_post = [
  body('name').isLength({min: 1, max: 100}).escape().withMessage('You must enter a valid category'),
  body('description').escape().trim(),

  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    console.log(req.body)

    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('categories_add', { title: 'Create Category', category: req.body, errors: errors.array() });
        return;
    }
    else {
        // Data from form is valid.
        // Create an Author object with escaped and trimmed data.
        var category = new Category(
            {
                name: req.body.name,
                description: req.body.description
            });
        category.save(function (err) {
            if (err) { return next(err); }
            // Successful - redirect to new author record.
            res.redirect(category.url);
        });
    }
}


]

exports.delete_category_get = function (req, res, next) {
  async.parallel({
    category: function (callback) {
        Category.findById(req.params.id)
        .exec(callback)
    },
    products: function (callback) {
        Product.find({ 'category': req.params.id })
        .exec(callback)
    },
}, function (err, results) {
    if (err) { return next(err); }
    if (results.category == null) { // No results.
        res.redirect('/category/');
    }
    // Successful, so render.
    res.render('category_delete', { title: 'Delete Category', category: results.category, category_products: results.products });
});
}



// Product.find({category:req.params.id})
//   .exec(function (err, category_inventory) {
//     if (err) { return next(err); }
//     console.log(category_inventory)
//     res.render('category_inventory', { title: 'Current Inventory', inventory: category_inventory})