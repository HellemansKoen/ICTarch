const AWS = require("aws-sdk");
const Region = "us-east-1";
const BUCKETNAME = "buckets3project";

let s3 = new AWS.S3({
  region: Region,
});

function uploadFile(file, fileKey) {
  const params = {
    Bucket: BUCKETNAME,
    Key: fileKey,
    Body: file.data,
  };

  try {
    s3.putObject(params).promise();
    return file.name + " Uploaded";
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
}

function download(fileKey) {
  const params = {
    Bucket: BUCKETNAME,
    Key: fileKey,
  };

  try {
    return s3.getObject(params).createReadStream();
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  uploadFile,
  download,
};
