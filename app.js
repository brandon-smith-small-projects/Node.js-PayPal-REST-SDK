const express = require("express");
const ejs = require("ejs");
const paypal = require("paypal-rest-sdk");

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AWDRYOyOjiPrCDuyPHi39GUwiIBuCDoz7QGxH30fqMkZpmMjZpOPedQuw7W2vYZeTt49J9Zo26_UfwQQ',
    'client_secret': 'ENfsKxkqnTDUA5HPiAZYqsOyva09vJyLyb109kIZxIRvMKN9ohGUMBuXQuP06oXnLZH4TKZ3mw52KNsq'
});

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.post('/pay', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://youtube-tutorials-cowboy8038.c9users.io/success",
            "cancel_url": "https://youtube-tutorials-cowboy8038.c9users.io/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox hat",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "Hat For The Boston Red Sox"

        }]
    };

    paypal.payment.create(create_payment_json, function(error, payment) {
        if (error) {
            throw error;
        }
        else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
});

app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        }
        else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.send('Success')
        }
    });
});

app.get('/cancel', (req, res) => res.send('Cancelled'))

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
