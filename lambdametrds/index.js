var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'dbproject.cidfnmmcutrg.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'azerty123',
    database: 'project_dev',
});

const getData = () => {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM gif_metadata", (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const deleteData = () => {
    return new Promise(function(resolve, reject) {
        connection.query(`delete from file_metadata
                            where CURRENT_DATE() = creatieDatum`,
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
}

exports.handler = async(event) => {
    try {
        const res = await deleteData();
        console.log(res);
        const response = {
            statusCode: 200,
            body: JSON.stringify(res),
        };
        return response;
    } catch (err) {
        return {
            statusCode: 404,
            body: JSON.stringify(err)
        };
    }
};