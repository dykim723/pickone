var postApp = angular.module('starter', ['ionic']);
var userInput = { 'title': '', 'content': '' };

function deleteListItem() {
	this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);
	
	if(document.getElementsByName('fileInput').length == 0)
	{
		document.getElementById('textArea').style.height = '70vh';
	}
}

function isAcceptableType(type) {
	if(type === 'image/jpeg' || type === 'image/png' || type === 'audio/mp3' 
		|| type === 'audio/wav' || type === '')
	{
		return true;
	}
	return false;
}

postApp.controller('postCtrl', function ($scope, $http) {
    $scope.appName = 'Ensemble에 게시';
    $scope.postData = userInput;
    $scope.testFile;

    $scope.onClickPost = function () {
		var uploadUrl = "http://localhost:3000/postingUpload";
        var fd = new FormData();
		var len = document.getElementsByName('fileInput').length;
		
		fd.append('title', $scope.postData.title);
		fd.append('content', $scope.postData.content);
		
		for(var i = 0; i < len; i++)
		{
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
		var element = document.getElementById('fakeInputFile');
		
		if (element.value.length != 0 && isAcceptableType(element.files[0].type) == true)
		{
			var input = document.createElement('input');
			var length = 0;
			var listItem = document.createElement('li');
			var img = document.createElement('img');
			var a = document.createElement('a');
			var imgSrc = null;
			var div = document.createElement('div');
			
			input.setAttribute('type', 'file');
			input.setAttribute('name', 'fileInput');
			input.setAttribute('hidden', '');
			input.files[0] = element.files[0];
						
			a.onclick = deleteListItem;
			a.innerHTML = '삭제';
			
			div.appendChild(input);
			div.appendChild(img);
			div.appendChild(a);
			
			length = document.getElementsByName('fileInput').length;
			
			//check image/jpeg, image/png
			if(element.files[0].type === 'image/jpeg' || element.files[0].type === 'image/png')
			{
				imgSrc = URL.createObjectURL(element.files[0]);
				img.setAttribute('src', imgSrc);
				img.style.width = '85vw';
				
				listItem.setAttribute('class', 'item');
				listItem.setAttribute('align', 'center');
				listItem.appendChild(div);
			}
			else if(element.files[0].type === 'audio/mp3' || element.files[0].type === 'audio/wav' || element.files[0].type === '')
			{
				var audioPlayer = document.createElement('audio');
				var source = document.createElement('source');
				var select = document.createElement('select');
				var option = null;
				var optionVal = new Array('Guitar', 'Base', 'Drum', 'Piano', 'Vocal');
				
				imgSrc = './img/icon-music-file.png';
				img.setAttribute('src', imgSrc);
				
				source.setAttribute('src', URL.createObjectURL(element.files[0]));
				source.setAttribute('type', element.files[0].type);
				
				audioPlayer.setAttribute('controls', '');
				audioPlayer.appendChild(source);
				
				for(var i = 0; i < optionVal.length; i++)
				{
					option = document.createElement('option');
					option.value = optionVal[i];
					option.innerHTML = optionVal[i];
					select.appendChild(option);
				}
				
				div.setAttribute('class', 'input-label');
				div.appendChild(audioPlayer);
				
				listItem.setAttribute('class', 'item item-thumbnail-left item-input item-select');				
				listItem.appendChild(div);
				listItem.appendChild(select);
			}
			
			document.getElementById('ionList').appendChild(listItem);
			document.getElementById('textArea').style.height = '50vh';
			element.value = null;
			element.files[0] = null;
		}
	}
});
