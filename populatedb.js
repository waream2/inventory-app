#! /usr/bin/env node

console.log('This script populates some test products and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Product = require('./models/product')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var products = []
var categories = []

function productCreate(name, description, category, price, inStock, cb ) {
  productDetail = { name: name, description: description, category: category, price: price, inStock: inStock  }


  var product = new Product(productDetail);

  product.save(function (err) {
    if (err) {
      // cb(err, null)
      return;
    }
    console.log('New Product: ' + product);
    products.push(product)
    // cb(null, product)
  }  );
}

function categoryCreate(name, description, cb) {
  var category = new Category({ name: name, description: description });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null,category);
  }   );
}


function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('SUV', 'Tesla\'s line of SUVs, to include: Model X and Model Y', callback);
        },
        function(callback) {
          categoryCreate('Sedan', 'Tesla\'s line of sedanss, to include: Model 3 and Model S', callback);
        },
        function(callback) {
          categoryCreate('Roadster', 'Tesla\'s line of SUVs, to include: The Roadster', callback);
        },
        ],
        // optional callback
        cb);
}


function createProducts(cb) {
    async.parallel([
        function(callback) {
          productCreate('Model 3 Dual Motor', 'The model 3 with a dual motor. Super fast, super fun.', categories[1], 54000, true , callback);
        },
        function(callback) {
          productCreate("Model 3 Extended Range", 'The model 3 with a extended range. Road Trips Galore.', categories[1], 63000, true, callback);
        },
        function(callback) {
          productCreate("Model 3 RWD", 'The model 3 with a RWD. Still fun af.', categories[1], 45000, true, callback);
        },
        function(callback) {
          productCreate("Model S P90D", "The first, the OG. Model S that's fast, fast.", categories[1], 80000, true, callback);
        },
        function(callback) {
          productCreate("Model S P100D","The first, the OG. Model S that's fast, fast. fast.", categories[1], 10000, true, callback);
        },
        function(callback) {
          productCreate('Model Y', 'Bigger Model 3', categories[0], 60000, true, callback);
        },
        function(callback) {
          productCreate('Roadster', 'just really stupid fast', categories[2], 160000, false, callback)
        },
        function(callback) {
          productCreate('Roadster', 'just really stupid fast', categories[2], 160000, false, callback)
        },
        function(callback) {
        },
        ],
        // optional callback
        cb);
}




async.series([
    createCategories,
    createProducts
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Teslas: '+products);

    }
    // All done, disconnect from database
    mongoose.connection.close();
});



