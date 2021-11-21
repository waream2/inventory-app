var Product = require('../models/product')
let Category = require('../models/category')
var async = require('async');

// see all products
exports.product_list = function(req, res, next) {
  Product.find({})
  .populate('category')
  .exec(function (err, inventory) {
    if (err) { return next(err); }
    console.log('hello world')
    res.render('product_view', { title: 'View Full Inventory', inventory: inventory });
});
}