const express = require('express')
const bodyParser = require("body-parser");
const AWS = require('aws-sdk');
const fileUpload = require("express-fileupload")
const Region = "us-east-1";
const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { GetObjectCommand } = require("@aws-sdk/client-s3")
const s3 = new S3Client({ region: Region })
const app = express();
const security = require('./security');
const { response } = require('express');
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

// Downloaden bestanden --> nog doen
app.get("/api/files/:uuid", async(req, res) => {
    const response = await downloadFile(req.params.uuid);
    res.download("hallo");
});

const downloadFile = async(bestand) => {
    const bucketParams = {
        Bucket: "buckets3project",
        key: bestand.name
    }
    const response = await s3.send(new GetObjectCommand(bucketParams));
    return response;
}

// Uploaden bestanden ==> vragen voor na te kijken
app.post("/uploaden", (req, res) => {
    const promise = uploadFile(req.files.bestand);
    promise.then((response) => {
            console.log("goed");
            res.status(201).json({ "message": "jippie" });
        })
        .catch((err) => {
            console.log("slecht");
            res.status(400).json({ "message": "spijtig" });
        })
});
const uploadFile = (bestand) => {
    // Setting up S3 upload parameters
    const params = {
        Bucket: "buckets3project",
        Key: bestand.name, // File name you want to save as in S3
        Body: bestand.data
    };
    // Uploading files to the bucket
    return s3.send(new PutObjectCommand(params));
}

// luister naar poort
app.listen(3000, () => {
    console.log('Started api on http://localhost:3000');
});