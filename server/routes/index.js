var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 // res.render('index', { title: 'Express' });
  console.log('Hello World!!');
  res.json({text:"hello ionic!!!"});
});

module.exports = router;
