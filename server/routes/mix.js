var express = require('express');
var router = express.Router();
var mixLib = 'lib/mixer.py';
var path = require('path');
var connection = require('./util/db');
var mysql = require('mysql');

var PythonShell = require('python-shell');

function Mix(boardNo) {
  var _boardNo = boardNo;

  this.getCount = function(){
    var queryGetCount = 'SELECT COUNT(boardNo) from FileInfo WHERE boardNo = ?';
    connection.query(queryGetCount, mysql.escape(_boardNo), function(err,rows){
      if(err) throw err;

      console.log('Data received from Db:\n');
      console.log(rows);
      return rows;
    });
  }

  this.run = function(){
    var queryGetFilePaths = 'SELECT FilePath from FileInfo WHERE boardNo = ?';
    connection.query(queryGetFilePaths, mysql.escape(_boardNo), function(err, rows){
      if(err) throw err;

      console.log('Data received from Db:\n');
      console.log(rows);


      var options = {
        mode: 'text',
        args: []
      };

      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        console.log(row.FilePath);

        options.args.push(row.FilePath);
      }
      console.log(options.args);

      PythonShell.run('lib/mixer.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
      });

    });
  }
};

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send('Start Mixing !!!!');

  req.accepts('application/json');
  json = req.body;
  console.log(json.BOARD_NO);

  var mix = new Mix(json.BOARD_NO);

  mix.run();


});

module.exports = router;
