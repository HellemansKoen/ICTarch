const mysql = require('mysql')

let connection = mysql.createConnection({
    host: 'dbproject.cidfnmmcutrg.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'azerty123',
    database: 'project_dev'
});

const fileInsert = (uuid, file, datum) => {
    connection.query(`INSERT INTO file_metadata(uuid,filename, creatieDatum) VALUES("${uuid}", "${file}", "${datum}")`);
}

module.exports = {
    fileInsert
}