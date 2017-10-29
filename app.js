const express = require("express");
const ejs = require("ejs");
const paypal = require("paypal-rest-sdk");

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
