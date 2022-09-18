// DEPENDENCIES
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require('./models/products');
const methodOverride = require("method-override")
​
// DATABASE CONFIGURATION
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
​
// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));
​
// MIDDLEWARE  & BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(express.static(__dirname + '/public'));
​
// ROUTES
//SEED
const productsSeed = require("./models/productsSeed.js");
​
app.get('/products/seed', (req, res) => {
    Product.deleteMany({}, (error, allProducts) => { });
​
    Product.create(productsSeed, (error, data) => {
        res.redirect("/products")
    })
});
​
// INDEX
app.get('/products', (req, res) => {
    Product.find({}, (error, allProducts) => {
        res.render('index.ejs', {
            products: allProducts
        })
    })
});
​
// NEW
app.get("/products/new", (req, res) => {
    res.render('new.ejs')
});
​
// DELETE
app.delete("/products/:id", (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, data) => {
        res.redirect("/products")
    })
})
​
// UPDATE
app.put("/products/:id", (req, res) => {
    if(req.body.buy <=  0){ 
        req.body.buy = ('OUT OF STOCK'); 
    } else { 
         req.body.buy = (`${req.body.buy -=1}`);
        }
    Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        },
        (error, updatedProduct) => {
            res.redirect(`/products/${req.params.id}`)
        }
    )
})
​
// CREATE
app.post('/products', (req, res) => {
    Product.create(req.body, (error, createdProduct) => {
        res.redirect("/products");
    });
});
​
// EDIT
app.get("/products/:id/edit", (req, res) => {
    Product.findById(req.params.id, (error, foundProduct) => {
        res.render("edit.ejs", {
            product: foundProduct,
        })
    })
})
​
// SHOW
app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
        res.render("show.ejs", {
            product: foundProduct
        })
    });
});
​
// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`express is listening on port: ${PORT}`)
});