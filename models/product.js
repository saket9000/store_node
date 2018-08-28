var restful = require("node-restful");
var mongoose = restful.mongoose;

var Schema = mongoose.Schema;
var productSchema = new Schema({
	pid: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	price: Number
});

module.exports = restful.model('Product', productSchema);
