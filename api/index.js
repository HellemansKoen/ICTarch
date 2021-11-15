const loginfo = require('');
const
const express = require('express')
const app = express();
app.use(express.json());
var security = require('./security');
security.validateToken('test');

app.get('/', (req, res) => {
    res.json('Hello world');
});

app.get('/post', (req, res) => {

});

app.get('/login', (req, res) => {

});

app.listen(3000, () => {
    console.log('Started api on http://localhost:3000');
})