var express = require('express');
var router = express.Router();
var mixLib = 'lib/mixer.py';
var path = require('path');
var connection = require('./util/db');
var mysql = require('mysql');
var fs = require('fs')

var PythonShell = require('python-shell');

function Mix(boardNo) {
  var _boardNo = boardNo;

  this.getCount = function(){
    var queryGetCount = 'SELECT COUNT(boardNo) from FileInfo WHERE boardNo = ?';
    connection.query(queryGetCount, mysql.escape(_boardNo), function(err,rows){
      if(err) throw err;

      //console.log('Data received from Db:\n');
      //console.log(rows);
      return rows;
    });
  }

  this.run = function(callback){
    var queryGetFilePaths = 'SELECT Email, FilePath from FileInfo WHERE boardNo = ?';
    connection.query(queryGetFilePaths, _boardNo, function(err, rows){
      if(err) throw err;

      //console.log('Data received from Db:\n');
      //console.log(rows);


      var options = {
        mode: 'text',
        args: []
      };

      if(rows.length != 0) {
        options.args.push(rows[0].Email);

        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          //console.log(row.FilePath);

          options.args.push(row.FilePath);
        }
      }


      //console.log(options.args);

      PythonShell.run('lib/mixer.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        callback();
      });

    });
  }
};

/* GET users listing. */
router.get('/*', function(req, res, next) {
  //res.send('Start Mixing !!!!');
  var boardNo = req.query.board_no;
  console.log('board_no:', boardNo);

  var mix = new Mix(boardNo);

  mix.run(function(){
    /*fs.readFile('/upload/TestEmail@gmail.com/Lecture002.mp3', function(error, data){
      res.writeHead(200, { 'Content-Type': 'audio/mp3'});
      res.end(data);
    });*/
  });


});

module.exports = router;
