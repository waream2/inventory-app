const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema(
	{
		name: {
			type: String, required: true, minLength: 3, maxLength: 100,
		},
		description: String,
	},
);

// Virtual for category's url
categorySchema
	.virtual('url')
	.get(function () {
		return `/category/${this._id}`;
	});

// Export model
module.exports = mongoose.model('Category', categorySchema);
