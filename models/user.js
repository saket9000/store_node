var restful = require("node-restful");
var mongoose = restful.mongoose;

var Schema = mongoose.Schema;
var userSchema = new Schema({
	name: String,
	phone: Number,
	email: {
    	type: String,
    	required: true,
    	unique: true,
    	lowercase: true,
    	validate: (value) => {
      		return validator.isEmail(value)
    	}
	},
	username: { type: String, required: true , unique: true},
});

module.exports = restful.model('User', userSchema);
