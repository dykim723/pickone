/**
 * Created by dykim on 2017-02-11.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : '52.78.143.80',
    user     : 'root',
    password : 'qlqjs1989',
    database : 'EnsembleDB'
});
connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;