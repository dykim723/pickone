var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var multer = require('multer');
var fs = require('fs');

var leftFileNmae = '';
var rightFileNmae = '';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dirPath = './upload/' + req.body.UserNo.substring(2, req.body.UserNo.length);

        if(fs.existsSync(dirPath) == false)
        {
            fs.mkdir(dirPath, 0777, function(err) {
                if(err)
                  console.log('err mkdir');
                else
                  console.log('Created newdir');
            });
        }

        cb(null, dirPath)
    },
    filename: function (req, file, cb) {
        var userNo = req.body.UserNo.substring(2, req.body.UserNo.length);
        var dirPath = './upload/' + userNo + '/';
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

router.post('/', upload.array('file', 5), function (req, res) {
    var title;
    var leftText;
	var rightText;
    var userNo;
	var pickCount = 0;
    var pageNo = 0;
    
    title = req.body.Title.substring(2, req.body.Title.length);
    leftText = req.body.LeftText.substring(2, req.body.LeftText.length);
	rightText = req.body.RightText.substring(2, req.body.RightText.length);
	pickCount = req.body.PickCount.substring(2, req.body.PickCount.length);
    userNo = req.body.UserNo.substring(2, req.body.UserNo.length);
    
	console.log('Title ' + title);
    console.log('leftText ' + leftText);
    console.log('UserNo ' + userNo);
	console.log('leftFileNmae ' + leftFileNmae);
	console.log('rightFileNmae ' + rightFileNmae);
    
	connection.query('INSERT INTO Page VALUES(0, ' + userNo + ', "' + title + '", ' + pickCount + ', now())', function(err, result) {
		if (err) {
            console.log('insert page query fail');
            return;
        }
        else {
            console.log('insert page query success');
            connection.query('SELECT PageNo FROM Page WHERE UserNo = "' + userNo + '" ORDER BY PageNo DESC' , function(err, result) {
                if (err) {
                    console.log('select page query fail');
                    return;
                }
                else {
                    console.log('select page query success');
                    console.log('result.PageNo ' + result[0].PageNo);
					pageNo = result[0].PageNo;
					
					var insertContentData = {ContentNo: 0, PageNo: pageNo
					, ContentText: leftText, Image: leftFileNmae};
					connection.query('INSERT INTO Content SET ?', insertContentData, function(err, result) {
						if (err) {
							console.log('insert content query 1 fail');
							return;
						}
						else {
							console.log('insert content query 1 success');
							insertContentData = {ContentNo: 0, PageNo: pageNo
							, ContentText: rightText, Image: rightFileNmae};
							connection.query('INSERT INTO Content SET ?', insertContentData, function(err, result) {
								if (err) {
									console.log('insert content query 2 fail');
									return;
								}
								else {
									console.log('insert content query 2 success');
									res.json({'PageNo': ''+pageNo});
									leftFileNmae = '';
									rightFileNmae = '';
								}
							});
						}
					});
                }
            });
        }
	});
});

module.exports = router;
