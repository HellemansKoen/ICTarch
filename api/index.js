const express = require('express')
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const s3 = require("./s3")
const app = express();
const security = require('./security');
const { v4: uuidv4 } = require('uuid');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'dbproject.cidfnmmcutrg.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'azerty123',
    database: 'project_dev'
});

connection.connect();
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
        .then((cogResponse) => res.status(201).json(cogResponse))
        .catch((cogResponse) => res.status(404).json(cogResponse))
});
// Uploaden ==> werkt ong
app.post('/api/files', (req, res) => {
    // S3
    //if (validateToken()) {
    const file = req.files.myfile;
    const uuid = uuidv4()
    if (!file) {
        res.send("Niet verzonden")
    } else {
        const output = s3.uploadFile(file, uuid + ":" + file.name)
        res.send(output);
        // RDS
        rdsUpload(uuid, file, res);
    }
    /*
    } else {
        res.send("inoggen is verplicht om files te uploaden");
    }*/
});

/* oorspronkelijk
 app.post('/api/files', (req, res) => {
    // S3
    if (validateToken()) {
        const file = req.files.myfile;
        const uuid = uuidv4()
        if (!file) {
            res.send("Niet verzonden")
            return
        }
        const output = s3.uploadFile(file, uuid + ":" + file.name)
        res.send(output);
        // RDS
        rdsUpload(uuid, file, res);
    } else {
        res.send("inoggen is verplicht om files te uploaden");
    }
}); 
*/

// validateToken nog testen
function validateToken() {
    security.login(req.body.email, req.body.password).catch((err) => {
        console.error(err)
    }).then((e) => {
        let JWT = e.accessToken.jwtToken;
        res.send(sub)
    });
    const validation = await security.validateToken(JWT).catch((err) => err)
    if (validation === "Valid Token.") {
        return true;
    } else {
        return false;
    }
}

function rdsUpload(uuid, file, res) {
    let datum = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // Datum toevoegen
    connection.query(`insert into file_metadata (uuid,filename, creatieDatum) values ("${uuid}", "${file.name}", "${datum}")`, function(error, results, fields) {
        if (error) {
            res.status(400).json(result);
            throw error;
        } else {
            res.status(200).json(result);
        }
    });
};
// Downloaden ==> werkt
app.get('/api/files/:uuid', (req, res) => {
    //if (validateToken()) {
    const uuid = req.params.uuid
    res.attachment(uuid.split(":")[1])
    const readStream = s3.download(uuid)
    readStream.pipe(res)
        /*
        } 
        else {
            res.send("inoggen is verplicht om files te downloaden");
        }
        */
});
// Luistert naar poort
app.listen(80, () => {
    console.log('Started api on http://localhost:80');
});