const express = require('express')
const bodyParser = require("body-parser");
const AWS = require('aws-sdk');
const fileUpload = require("express-fileupload")
const Region = "uw-east-1";
const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({ region: Region })
const app = express();
const security = require('./security');
app.use(fileUpload())
app.use(express.json());
app.use(bodyParser.json());
// Homepage
app.get('/', (req, res) => {
    res.json('Hello world');
});
// Registreren
app.post('/register', (req, res) => {
    security.registerUser(req.body.email, req.body.password)
        .then((cogResponse) => res.status(201).json(cogResponse))
        .catch((cogResponse) => res.status(404).json(cogResponse))
});
// login
app.post('/login', (req, res) => {
    security.login(req.body.email, req.body.password)
        .then((cogResponse) => res.status(201).json(cogResponse))
        .catch((cogResponse) => res.status(404).json(cogResponse))
});
// luister naar poort
app.listen(3000, () => {
    console.log('Started api on http://localhost:3000');
});
// Downloaden bestanden --> nog doen
app.get("/api/files/{uuid} ", (req, res) => {});
// Uploaden bestanden ==> vragen voor na te kijken
app.post("/uploaden", (req, res) => {
    uploadFile(req.files.bestand);
});
const uploadFile = (bestand) => {
    // Setting up S3 upload parameters
    const params = {
        Bucket: "buckets3project",
        Key: bestand.name, // File name you want to save as in S3
        Body: bestand.data
    };
    // Uploading files to the bucket
    s3.send(new PutObjectCommand(params));
}