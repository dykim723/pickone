var app = require('express')();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var multer = require('multer');
var fs = require('fs');

var leftFileNmae = '';
var rightFileNmae = '';

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
        var email = req.body.Email.substring(2, req.body.Email.length);
        var dirPath = './upload/' + email + '/';
        var fileName = file.originalname.substring(2, file.originalname.length);
        var fileNameBuff = file.originalname.substring(2, file.originalname.length);
        var fileNum = 1;

        while(fs.existsSync(dirPath + fileNameBuff))
        {
            fileNameBuff = fileNum + '_' + fileName
            fileNum++;
        }

		if(fileName === 'LeftImage.jpg')
		{
			leftFileNmae = fileNameBuff;
		}
		else if(fileName === 'RightImage.jpg')
		{
			rightFileNmae = fileNameBuff;
		}
		
        cb(null, fileNameBuff)
    }
});
var upload = multer({ storage: storage });

var connection = mysql.createConnection({
  host     : '52.78.143.80',
  user     : 'root',
  password : 'qlqjs1989',
  database : 'PickOneDB'
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

app.post('/', upload.array('file', 5), function (req, res) {
    var title;
    var leftText;
	var rightText;
    var email;
    var contentNo = 0;
    
    title = req.body.Title.substring(2, req.body.Title.length);
    leftText = req.body.LeftText.substring(2, req.body.LeftText.length);
	rightText = req.body.RightText.substring(2, req.body.RightText.length);
    email = req.body.Email.substring(2, req.body.Email.length);
    
	console.log('Title ' + title);
    console.log('leftText ' + leftText);
    console.log('Email ' + email);
    
    var insertData = {ContentNo: 0, Email: email, Title: title
	, LeftText: leftText, LeftImage: leftFileNmae, LeftPick: 0
	, RightText: rightText, RightImage: rightFileNmae, RightPick: 0
	, RegDate: null};
  
	connection.query('INSERT INTO Content SET ?', insertData, function(err, result) {
		if (err) {
            console.log('insert query fail');
            return;
        }
        else {
            console.log('insert query success');
            connection.query('SELECT ContentNo FROM Content WHERE Email = "' + email + '" ORDER BY ContentNo DESC' , function(err, result) {
                if (err) {
                    console.log('select query fail');
                    return;
                }
                else {
                    console.log('select query success');
                    console.log('result.ContentNo ' + result[0].ContentNo);
					contentNo = result[0].ContentNo;
					res.json({'ContentNo': ''+contentNo});
                }
            });
        }
	});
	
	leftFileNmae = '';
	rightFileNmae = '';
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});