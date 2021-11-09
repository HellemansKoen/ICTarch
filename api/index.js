const express = require('express')
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.json('Hello world!');
});
app.listen(3000, () => {
    console.log('Started api on http://localhost:3000');
})