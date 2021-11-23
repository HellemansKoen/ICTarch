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
app.listen(3000, () => {
    console.log('Started api on http://localhost:3000');
})
app.post("/downloaden/:nummer", (req, res) => {});
// nieuw --> proberen uploaden
app.post("/upload", (req, res) => {
    uploadFile(req.params.file);
});
const fs = require('fs');
const AWS = require('aws-sdk');
const uploadFile = (bestand) => {
    // Read content from the file
    const fileContent = fs.readFileSync(bestand);
    // Setting up S3 upload parameters
    const params = {
        Bucket: buckets3project,
        Key: bestand.fileName, // File name you want to save as in S3
        Body: fileContent
    };
    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
}