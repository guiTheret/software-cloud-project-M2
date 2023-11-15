
var mysql = require('mysql');
require('dotenv').config();
var connection = mysql.createConnection({
  host : process.env.HOST_SQL,
  user : process.env.USER,
  password : process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true
});

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;