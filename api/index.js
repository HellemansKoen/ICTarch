const express = require('express')
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const s3 = require("./s3")
const app = express();
const security = require('./security');
const db = require("./db.js")
const {
    v4: uuidv4
} = require('uuid');

//connection.connect();
app.use(fileUpload())
app.use(express.json());
app.use(bodyParser.json());
// // Homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
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
        .then((e) => {
            res.send(e)
        })
        .catch((err) => {
            console.error("err")
        });
});
// Uploaden ==> werkt
app.post('/api/files', async(req, res) => {
    // S3
    const validation = await security.validateToken(req.body.token).catch((err) => err)
    if (validation === "Valid Token.") {
        const file = req.files.myfile;
        const uuid = uuidv4()
        if (!file) {
            res.send("Niet verzonden")
        }
        const output = s3.uploadFile(file, uuid + ":" + file.name)
        res.send(output);
        // RDS
        rdsUpload(uuid, file, res);
    } else {
        res.send("inoggen is verplicht om files te uploaden");
    }
});
// RDS ==> werkt
function rdsUpload(uuid, file, res) {
    let datum = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // Datum toevoegen
    db.fileInsert(uuid, file.name, datum),
        function(error, results, fields) {
            if (error) {
                res.status(400).json(result);
                throw error;
            } else {
                res.status(200).json(result);
            }
        }
};
// Downloaden ==> werkt
app.get('/api/files/:uuid', async(req, res) => {
    const validation = await security.validateToken(req.query.token).catch((err) => err)
    if (validation === "Valid Token.") {
        const uuid = req.params.uuid
        res.attachment(uuid.split(":")[1])
        const readStream = s3.download(uuid)
        readStream.pipe(res)
    } else {
        res.send("inoggen is verplicht om files te downloaden");
    }
});
// Luistert naar poort
app.listen(80, () => {
    console.log('Started api on http://localhost:80');
});