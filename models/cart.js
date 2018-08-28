var restful = require("node-restful");
var mongoose = restful.mongoose;

var user = require("../models/user.js");
var product = require("../models/product.js");

var Schema = mongoose.Schema;

var cartSchema = new Schema({
	user:({
		type: Schema.ObjectId,
		ref: 'user',
		unique: true,
		required: true
	}),
	product: [{
		type: Schema.ObjectId,
		ref: 'user',
		required:true
	}],
	amount: Number
});

module.exports = restful.model('Cart', cartSchema);
