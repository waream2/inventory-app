const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
	name: String,
	description: String,
	category: { type: Schema.Types.ObjectId, ref: 'Category' },
	price: Number,
	inStock: Boolean,
});

// virtual for product's url
productSchema
	.virtual('url')
	.get(function () {
		return `/category/product/${this._id}`;
	});

// virtual for price to string
productSchema
	.virtual('formattedPrice')
	.get(function () {
		return this.price.toLocaleString('en-US');
	});

module.exports = mongoose.model('Product', productSchema);
