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
// Registreren ==> werkt
app.post('/register', (req, res) => {
    security.registerUser(req.body.email, req.body.password)
        .then((cogResponse) => res.status(201).json(cogResponse))
        .catch((cogResponse) => res.status(404).json(cogResponse))
});
// Login ==> werkt
app.post('/login', (req, res) => {
    security.login(req.body.email, req.body.password)
        .then((cogResponse) => res.status(201).json(cogResponse))
        .catch((cogResponse) => res.status(404).json(cogResponse))
});
// Downloaden bestanden --> werkt niet
app.get("/downloaden/:uuid", (req, res) => {
    const promise = downloadFile(req.params.uuid);
    console.log(promise)
    promise
        .then(() => {
            console.log("goed");
            res.status(201).json({ "message": "goed gedownload" });
        })
        .catch(() => {
            console.log("slecht");
            res.status(400).json({ "message": "niet gedownload" });
        });
});
const downloadFile = (bestand) => {
    const bucketParams = {
        Bucket: "buckets3project",
        key: bestand
    }
    const response = s3.send(new GetObjectCommand(bucketParams));
    console.log(response)

    return response;

};
// Uploaden bestanden ==> werkt
app.post("/uploaden", (req, res) => {
    const promise = uploadFile(req.files.bestand);
    console.log(promise);
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
    const params = {
        Bucket: "buckets3project",
        Key: bestand.name,
        Body: bestand.data
    };
    return s3.send(new PutObjectCommand(params));
};
// Luistert naar poort
app.listen(3000, () => {
    console.log('Started api on http://localhost:3000');
});