let mysql = require('mysql');

const connPool = mysql.createPool({
    acquireTimeout: '5000',
    connectionLimit: '10',
    host: 'localhost',
    port: '3306',
    database: 'gambling4you',
    user: 'root',
    password: ''
});

module.exports.query = (sql, args) => {
    return new Promise((resolve, reject) => {
        connPool.query(sql, args, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}