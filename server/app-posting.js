var app = require('express')();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var multer = require('multer')
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dirPath = './upload/' + req.body.Email.substring(2, req.body.Email.length);
        
        if(fs.existsSync(dirPath) == false)
        {
            fs.mkdir(dirPath, 0666, function(err) {
                if(err)
                  console.log('err mkdir');
                else
                  console.log('Created newdir');
            });
        }
        
        cb(null, dirPath)
    },
    filename: function (req, file, cb) {
        var dirPath = './upload/' + req.body.Email.substring(2, req.body.Email.length) + '/';
        var fileName = file.originalname.substring(2, file.originalname.length);
        var fileNameBuff = file.originalname.substring(2, file.originalname.length);
        var fileNum = 1;

        while(fs.existsSync(dirPath + fileNameBuff))
        {
            fileNameBuff = fileNum + '_' + fileName
            fileNum++;
        }
        
        cb(null, fileNameBuff)
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

app.post('/', upload.array('file', 5), function (req, res) {
    var len = 0;
    var title;
    var content;
    var email;
    
    title = req.body.Title.substring(2, req.body.Title.length);
    content = req.body.Content.substring(2, req.body.Content.length);
    email = req.body.Email.substring(2, req.body.Email.length);
    
    console.log('title sub ' + req.body.Content.length);
	console.log('Title ' + title);
    console.log('Content ' + content);
    console.log('Email ' + email);
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});