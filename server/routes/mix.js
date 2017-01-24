var express = require('express');
var router = express.Router();
var mixLib = 'lib/mixer.py';
var path = require('path');

var PythonShell = require('python-shell');
var pyshell;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Start Mixing !!!!');

  pyshell = new PythonShell(mixLib);

  pyshell.on('message', function(message){
    console.log(message);
    //res.json({"ID":"1234", "STATE":"on"});


  });

// end the input stream and allow the process to exit
  pyshell.end(function (err) {
    if (err){
      throw err;
    };
    
    //res.json({"ID":"1234", "STATE":"finished"});
  });

});

module.exports = router;
