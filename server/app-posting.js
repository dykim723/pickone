var app = require('express')();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage });

var connection = mysql.createConnection({
  host     : '52.78.143.80',
  user     : 'ionicClient',
  password : 'qlqjs1989',
  database : 'EnsembleDB'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.post('/postingUpload', upload.array('file', 5), function (req, res) {
    console.log(req.body.title);
	console.log(req.body.content);
	
	var insertData = {BoardNo: 0, Text: req.body.content, Email: 'TestMail@gmail.com'};
  
	connection.connect(function(err) {
		if (err) {
		  console.error('error connecting: ' + err.stack);
		  return;
		}

		console.log('connected as id ' + connection.threadId);
	});
	connection.query('INSERT INTO Board SET ?', insertData, function(err, result) {
		//if (err) throw err;
		//console.log('The solution is: ', rows[0].solution);
	});
	connection.end();

	res.json(req.body);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});