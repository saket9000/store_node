var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost:27017/store-node', { useNewUrlParser: true });

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// app.use('/', function(req, res){
// 	res.send("HELLO");
// });
app.use('/api', require('./routes/api'));


app.listen("8000");
console.log("Listening on port 8000");
