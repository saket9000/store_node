var restful = require("node-restful");
var mongoose = restful.mongoose;

var product = require('./product.js');
var user = require('./user.js');

var Schema = mongoose.Schema;

var orderSchema = new Schema({
	orderDate: Date,
	customer: [{
		type: Schema.Types.ObjectId,
		ref: 'user',
		unique: true,
		required: true
	}],
	product: [{
		type: Schema.Types.ObjectId,
		ref: 'user',
		required:true
	}],
	amount: Number
});

module.exports = restful.model('Order', orderSchema);
