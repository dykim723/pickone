var postApp = angular.module('starter', ['ionic']);
var userInput = { 'title': '', 'content': '' };

function changeFileValue() {
    var length = document.getElementsByName('fileInput').length;
    var element = document.getElementsByName('fileInput')[length - 1];
    console.log('call onchange + ');
    console.log(element);
    console.log(element.value);

    if (element.value !== '')
    {
        document.getElementById('divInput').appendChild(element);
        console.log(document.getElementsByName('fileInput').length);
    }
    else
    {
        document.getElementById('divInput').removeChild(element);
        //element.remove();
    }
}

function checkNullFile() {
    var len = document.getElementsByName('fileInput').length;

    for(var i = 0; i < len; i++)
    {
        var element = document.getElementsByName('fileInput')[i];

        if (element.value.length == 0)
            document.getElementById('divInput').removeChild(element);
    }
}

postApp.controller('postCtrl', function ($scope, $http) {
    $scope.appName = "Angular ctrl";
    $scope.postData = userInput;
    $scope.testFile;

    $scope.onClickPost = function () {
		checkNullFile();
		
		var uploadUrl = "http://localhost:3000/postingUpload";
        var fd = new FormData();
		var len = document.getElementsByName('fileInput').length;
		
		fd.append('title', $scope.postData.title);
		fd.append('content', $scope.postData.content);
		
		for(var i = 0; i < len; i++)
		{
			console.log('test send');
			fd.append('file', document.getElementsByName('fileInput')[i].files[0]);
		}
		
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .success(function (res) {
			console.log(res);
        })
        .error(function (err) {
			console.log(err);
        });
    };

    $scope.clickFolder = function () {
        checkNullFile();

        var input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('name', 'fileInput');
        //input.setAttribute('hidden', '');
        input.onchange = changeFileValue;
        document.getElementById('divInput').appendChild(input);
        input.click();
    };
});
