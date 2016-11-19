var postApp = angular.module('starter', ['ionic']);
var userInput = { 'title': '', 'content': '' };

function checkNullFile() {
    var len = document.getElementsByName('fileInput').length;
	var element = null;
	
    for(var i = 0; i < len; i++)
    {
        element = document.getElementsByName('fileInput')[i];
        if (element.value.length == 0)
            document.getElementById('divInput').removeChild(element);
    }
}

function deleteListItem() {
	var element = document.getElementsByName('fileInput')[this.value];
	
	this.parentElement.parentElement.removeChild(this.parentElement);
	document.getElementById('divInput').removeChild(element);
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

	$scope.changeFileValue = function () {
		var element = this;
		
		if (element.value.length != 0)
		{
			document.getElementById('divInput').appendChild(element);
			var length = document.getElementsByName('fileInput').length;
			console.log(document.getElementsByName('fileInput').length);
			
			//check image/jpeg, image/png
			if(element.files[0].type === 'image/jpeg' || element.files[0].type === 'image/png')
			{
				var listItem = document.createElement('li');
				var img = document.createElement('img');
				var a = document.createElement('a');
				var imgSrc = URL.createObjectURL(element.files[0]);
				
				img.setAttribute('src', imgSrc);
				img.style.width = '85vw';
				
				a.onclick = deleteListItem;
				a.innerHTML = '삭제';
				a.value = length - 1;
				
				listItem.setAttribute('class', 'item');
				listItem.setAttribute('align', 'center');
				
				listItem.appendChild(img);
				listItem.appendChild(a);
				document.getElementById('ionList').appendChild(listItem);
			}
		}
	}
	
    $scope.clickFolder = function () {
        checkNullFile();
		
        var input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('name', 'fileInput');
		input.setAttribute('accept', '.jpg, .png, .mp3, .wav, .mp4, .ogg');
        input.setAttribute('hidden', '');
        input.onchange = $scope.changeFileValue;
        input.click();
    };
});
