const express = require('express')
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.json());

var security = require('./security');

app.get('/', (req, res) => {
    res.json('Hello world');
});

app.post('/register', (req, res) => {
    security.registerUser(req.body.email, req.body.password)
        .then((cogResponse) => res.status(201).json(cogResponse))
        .catch((cogResponse) => res.status(204).json(cogResponse))
});

app.post('/login', (req, res) => {
    security.login(req.body.email, req.body.password)
        .then((cogResponse) => res.status(201).json(cogResponse))
        .catch((cogResponse) => res.status(204).json(cogResponse))
});
app.post("/upload", (req, res) => {});


app.listen(3000, () => {
    console.log('Started api on http://localhost:3000');
})