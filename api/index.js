const express = require('express')
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const s3 = require("./s3")
// const Region = "us-east-1";
// const { S3Client } = require("@aws-sdk/client-s3");
// const { PutObjectCommand } = require("@aws-sdk/client-s3");
// const { GetObjectCommand } = require("@aws-sdk/client-s3")
// const s3 = new S3Client({ region: Region })
const app = express();
const security = require('./security');
// const { response } = require('express');
const { v4: uuidv4 } = require('uuid');


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
})

app.post('/api/files',(req,res)=>{
    const file = req.files.myfile;
    const uuid = uuidv4()
    if(!file){
        res.send("Niet verzonden")
        return
    }
    const output = s3.uploadFile(file,uuid + ":" + file.name)
    res.send(output)
})

app.get('/api/files/:uuid',(req,res)=>{
    const uuid = req.params.uuid
    res.attachment(uuid.split(":")[1])
    const readStream = s3.download(uuid)
    readStream.pipe(res)
})



// // Downloaden bestanden --> werkt niet
// app.get("/downloaden/:uuid", (req, res) => {
//     const promise = downloadFile(req.params.uuid);
//     console.log(promise)
//     promise
//         .then(() => {
//             console.log("goed");
//             res.status(201).json({ "message": "goed gedownload" });
//         })
//         .catch(() => {
//             console.log("slecht");
//             res.status(400).json({ "message": "niet gedownload" });
//         });
// });
// const downloadFile = (bestand) => {
//     const bucketParams = {
//         Bucket: "buckets3project",
//         key: bestand
//     }
//     const response = s3.send(new GetObjectCommand(bucketParams));
//     console.log(response)

//     return response;

// };
// Uploaden bestanden --> werkt ==> UUID nog toevoegen
// app.post("/uploaden", (req, res) => {
//     const promise = uploadFile(req.files.bestand);
//     promise.then(() => {
//             console.log("goed");
//             res.status(201).json({ "message": "jippie" });
//         })
//         .catch(() => {
//             console.log("slecht");
//             res.status(400).json({ "message": "spijtig" });
//         })
// });
// const uploadFile = (bestand) => {
//     let myuuid = uuidv4();
//     console.log('Your UUID is: ' + myuuid);
//     const params = {
//         Bucket: "buckets3project",
//         Key: myuuid + "." + bestand.name,
//         Body: bestand.data
//     };
//     console.log(bestand.name + ":" + myuuid);
//     return s3.send(new PutObjectCommand(params));
// };
// Luistert naar poort


app.listen(3000, () => {
    console.log('Started api on http://localhost:3000');
});

