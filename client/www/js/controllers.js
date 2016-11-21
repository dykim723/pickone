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

  if(element.files[0].type === 'image/jpeg' || element.files[0].type === 'image/png')
  {
    this.parentElement.parentElement.removeChild(this.parentElement);
  }
  else
  {
    this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);
  }

  document.getElementById('divInput').removeChild(element);

  if(document.getElementsByName('fileInput').length == 0)
  {
    document.getElementById('textArea').style.height = '69vh';
  }
}

angular.module('starter.controllers', [])
.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
  $scope.data = {};

  $scope.login = function() {
    LoginService.loginUser($scope.data.email, $scope.data.password).success(function(data) {
      $state.go('tab.dash');
    }).error(function(data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('postCtrl', function ($scope, $http) {
  $scope.appName = 'Ensemble에 게시';
  $scope.postData = userInput;
  $scope.testFile;

  $scope.onClickPost = function () {
    checkNullFile();

    var uploadUrl = "http://127.0.0.1:5000/postingUpload";
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
      var listItem = document.createElement('li');
      var img = document.createElement('img');
      var a = document.createElement('a');
      var imgSrc = null;

      //check image/jpeg, image/png
      if(element.files[0].type === 'image/jpeg' || element.files[0].type === 'image/png')
      {
        imgSrc = URL.createObjectURL(element.files[0]);
        img.setAttribute('src', imgSrc);
        img.style.width = '85vw';

        listItem.setAttribute('class', 'item');
        listItem.setAttribute('align', 'center');
        listItem.appendChild(img);

        a.onclick = deleteListItem;
        a.innerHTML = '삭제';
        a.value = length - 1;
        listItem.appendChild(a);
      }
      else if(element.files[0].type === 'audio/mp3' || element.files[0].type === 'audio/wav')
      {
        var audioPlayer = document.createElement('audio');
        var source = document.createElement('source');
        var select = document.createElement('select');
        var div = document.createElement('div');
        var option = null;
        var optionVal = new Array('Guitar', 'Base', 'Drum', 'Piano', 'Vocal');

        imgSrc = './img/icon-music-file.png';
        img.setAttribute('src', imgSrc);

        source.setAttribute('src', URL.createObjectURL(element.files[0]));
        source.setAttribute('type', element.files[0].type);

        audioPlayer.setAttribute('controls', 'true');
        audioPlayer.appendChild(source);

        for(var i = 0; i < optionVal.length; i++)
        {
          option = document.createElement('option');
          option.value = optionVal[i];
          option.innerHTML = optionVal[i];
          select.appendChild(option);
        }

        a.onclick = deleteListItem;
        a.innerHTML = '삭제';
        a.value = length - 1;

        div.setAttribute('class', 'input-label');
        div.appendChild(img);
        div.appendChild(audioPlayer);
        div.appendChild(a);

        listItem.setAttribute('class', 'item item-thumbnail-left item-input item-select');
        listItem.appendChild(div);
        listItem.appendChild(select);
      }

      document.getElementById('ionList').appendChild(listItem);
      document.getElementById('textArea').style.height = '52vh';
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
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };


});


