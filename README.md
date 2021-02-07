# Exercises for Full stack web development Tutorial Course
This repository is where you can find some really easy samples for the mentioned videos.

## Summary
I have skipped deploying websites to the server because that part isnt about coding. Meanwhile, you can now upload your HTML file at Github Page. 
Video 102-112 consists basic API request and response web data. This section Mongo local host is used to store data. Of course, you can build your own cluster (database) on Mongo (it's free). Postman is also used to send the request such as GET, POST, and PUT.


Here is my code.
'''
//dont forget to install express body-parser mongoose package before running the project
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var db = mongoose.connect('mongodb://127.0.0.1:27017/{dbName}',{useNewUrlParser:true, useUnifiedTopology: true });
var Product = require('./model/product');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function (request, response) {
    response.set({ 'Access-Control-Allow-Origin': '*' }); 
    Product.find({}, function (err, products) {
        if (err) {
            response.status(500).send({ error: "could not fetch product" });
        } else {
            response.send(products);
        }
    })
})
app.post('/', function (request, response) {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.likes = request.body.likes;
    product.imgUrl=request.body.imgUrl;
    product.save(function (err, savedProduct) {
        if (err) {
            response.status(500).send({ error: "Could not save" });
        } else {
            response.send(savedProduct);
        }

    })
})

app.listen(3000, function () {
    console.log('first api connected..')
});

'''

'''
//I put project.js in a folder called 'model'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema({
    title: String,
    price: Number,
    likes: {type:Number, default:0},
    imgUrl: String
});

module.exports=mongoose.model('Product', product);
'''

## Acknowledgments

* The videos are from MERN Stack Web Development Tutorial Course/ [See their channel](https://www.youtube.com/channel/UCDsEHTvh-YO80AZna7X7UVA)
