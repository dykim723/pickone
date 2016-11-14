var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 3,
    host: '52.78.143.80',
    user: 'ionicClient',
    database: 'EnsembleDB',
    password: 'qlqjs1989'
});


router.post('/', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        // Use the connection
        //console.log(req.query.email, req.query.password);
        var query;
        req.accepts('application/json');

        json = req.body;
        console.log(json.email, json.password);
        query = connection.query('SELECT * FROM UserInfo WHERE Email=? AND Password=?', [json.email, json.password] , function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            if(rows.length == 1){
                res.json({'status':'SUCCESS'});
            } else{
                res.json({'status':'FAIL'});
            }

            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });
});



module.exports = router;