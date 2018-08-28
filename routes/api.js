var express = require("express");
var mongoose = require("mongoose");
var async = require("async");
var router = express.Router();

var Product = require('../models/product.js');
var User = require('../models/user.js');
var Cart = require('../models/cart.js');
var Order = require('../models/order.js');

router.get('/fi:un', function(req, res){
	uname = req.params.un
	User.findOne({username:'abc'}, function(err, user){
		console.log(user);
	});
	// console.log(uname);
	res.send("Product get API");
})

Product.methods(['get', 'post', 'put', 'delete']);
Product.register(router, '/products');

User.methods(['get', 'post', 'put', 'delete']);
User.register(router, '/users');

Cart.methods(['get', 'delete']);
Cart.register(router, '/cart');

router.route('/cart').post(async function (req, res){
	// var cart = new Cart();
	uname = req.body.uname;
	pname = req.body.pname;
	var uid = await User.findOne({ username: uname }, function(err, user) {
		if (err) {
			throw err;
			return "USER NOT EXIST";
		} else {
			return user;
		}
	});
	var product_id = await Product.findOne({ name: pname }, function(err, _product) {
		if(err) {
			throw err;
			return "PRODUCT NOT EXIST";
		} else {
			return _product;
		}
	});
	amt = product_id.price;
	var cart_data = {
		user: uid,
		product: product_id,
		amount: amt
	};
	var cart = new Cart(cart_data);
	await cart.save( function(error, data){
		if(error){
			console.log("PROBLEM IN CART SAVE");
			res.json(error);
		}
		else{
			res.json(data);
		}
	});
	console.log("PRODUCT ADDED TO NEW CART SUCCESSFULLY");
	// var c = Cart.find({}).toArray(function(err, result){
		// res.send(data);
		// res.json(data);
		// console.log(result);
	// });
	// console.log(c._id);
});

router.route('/cart/:id').put(async function(req, res){
	cid = req.params.id;
	pname = req.body.pname;
	rtype = req.body.rtype;
	var product_id = await Product.findOne({ name: pname }, function(err, _product) {
		if(err) {
			throw err;
			return "PRODUCT NOT EXIST";
		} else {
			return _product;
		}
	});
	console.log(cid)
	console.log(product_id._id)
	if (rtype === "add"){
		// var cart = await Cart.update({_id: cid}, {$addToSet: {product:product_id._id}, $inc:{amount: product_id.price}});
		var cart = await Cart.update({_id: cid}, {$push: {product:product_id._id}, $inc: {amount: product_id.price}});
		res.send("PRODUCT ADDED FROM CART SUCCESSFULLY");
	} else if (rtype === "remove") {
		var cart = await Cart.update({_id: cid}, {$pull: {product:product_id._id}, $inc: {amount: -product_id.price}});
		res.send("PRODUCT REMOVED FROM CART SUCCESSFULLY");
	}
});

Cart.methods(['get', 'delete']);
Cart.register(router, '/order');

router.route('/order').post(async function(req, res){
	uname = req.body.uname;
	var uid = await User.findOne({ username: uname }, function(err, user) {
		if (err) {
			throw err;
			return "USER NOT EXIST";
		} else {
			return user;
		}
	});
	var cart = await Cart.findOne({user: uid}, function(err, _cart){
		if (err){
			throw err;
			res.send("CART NOT EXIST");
		} else {
			return _cart;
		}
	});
});


//EXAMPLE USING ASYNC AND AWAIT
// router.post('/find', async function(req, res){
// 	uname = req.body.uname;
// 	let uid = await User.findOne({username:uname}, function(err, user) {
// 		if (err) { 
// 			throw err;
// 		} else { 
// 			return user;
// 		}
// 	});
// 	res.send(uid);
// 	console.log(uid);
// });

function getUserId(uname){
	return new Promise(function(resolve,reject){
		var u = User.findOne({username:uname})
		if (error){
			console.log("NOT EXECUTING");
			reject(new Error('User not exist'));
		} else {
			console.log("EXECUTING");
			resolve(u);
			return u;
		}
	});
}

router.post('/findu', function(req,res){
	var i = req.body.uname;
	console.log(i);
	getUserId(i)
		.then(function(i){
			console.log("TRYING TO GET VALUE FRM FUCNTION IN Promise");
			return getUserId(i);
		})
		.catch(function(err)
			{console.log("ERROR");
		});
});

//DELETE AND VIEW FROM MONGO DB
router.get('/deleteTest', function(req, res){
	// var i = Cart.find({_id:'5b797a968388332dbd3f5e45'}).remove().exec();
	// if(i){
	// 	res.send("GOOD");
	// }


//CODE FOR DIRECT CONNECT TO MONGO DB FOR CHECK/TEST/VIEW
	// var MongoClient = require('mongodb').MongoClient;
	// var url = "mongodb://localhost:27017/";

	// MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
 //  		if (err) throw err;
 //  		var dbo = db.db("store-node");
 //  		dbo.collection("carts").find({}).toArray(function(err, result) {
 //    	if (err) throw err;
 //    	console.log(result);
 //    	db.close();
 //  		});
	// });
});

// router.route('/products').post(function (req, res) {
//     var p = new product();
//     p.title = req.body.title;
//     p.price = req.body.price;
//     p.instock = req.body.instock;
//     p.photo = req.body.photo;
//     p.save(function (err) {
//         if (err) {
//             res.send(err);
//         }
//         res.send({ message: 'Product Created !' })
//     })
// });


// router.post('/users', userController.create)
// router.post('/posts', postController.create)
// router.post('/comments', commentController.create)
// router.get('/users', userController.all)
// router.get('/posts', postController.all)


//CALL BACK EXAMPLE WITH GET USER DATA THEN CREATE CART (A WAY)

// First, setup the generic poem creator function; it will be the callback function in the getUserInput function below.
// function genericPoemMaker(name, gender) {
//     console.log(name + " is finer than fine wine.");
//     console.log("Altruistic and noble for the modern time.");
//     console.log("Always admirably adorned with the latest style.");
//     console.log("A " + gender + " of unfortunate tragedies who still manages a perpetual smile");
// }

//The callback, which is the last item in the parameter, will be our genericPoemMaker function we defined above.
// function getUserInput(firstName, lastName, gender, callback) {
//     var fullName = firstName + " " + lastName;

//     // Make sure the callback is a function
//     if (typeof callback === "function") {
//     // Execute the callback function and pass the parameters to it
//     callback(fullName, gender);
//     }
// }

// getUserInput("Michael", "Fassbender", "Man", genericPoemMaker);
// Output
/* Michael Fassbender is finer than fine wine.
Altruistic and noble for the modern time.
Always admirably adorned with the latest style.
A Man of unfortunate tragedies who still manages a perpetual smile.
*/


module.exports = router;
