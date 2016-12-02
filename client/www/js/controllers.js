angular.module('starter.controllers', [])

  .controller('AppCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.player = function() {
      $rootScope.player();
    }
  }])

  .controller('BrowseCtrl', ['$window', '$ionicPlatform', '$rootScope', '$scope', '$ionicScrollDelegate', 'AudioSvc', '$ionicModal',
    function($window, $ionicPlatform, $rootScope, $scope, $ionicScrollDelegate, AudioSvc, $ionicModal) {
      $scope.files = [];

      $ionicModal.fromTemplateUrl('templates/player.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $rootScope.hidePlayer = function() {
        $scope.modal.hide();
      };

      $rootScope.player = function() {
        $scope.modal.show();
      };

      $ionicPlatform.ready(function() {

        $rootScope.show('Accessing Filesystem.. Please wait');
        $window.requestFileSystem($window.LocalFileSystem.PERSISTENT, 0, function(fs) {
            //console.log("fs", fs);

            var directoryReader = fs.root.createReader();

            directoryReader.readEntries(function(entries) {
                var arr = [];
                processEntries(entries, arr); // arr is pass by refrence
                $scope.files = arr;
                $rootScope.hide();
              },
              function(error) {
                console.log(error);
              });
          },
          function(error) {
            console.log(error);
          });

        $scope.showSubDirs = function(file) {

          if (file.isDirectory || file.isUpNav) {
            if (file.isUpNav) {
              processFile(file.nativeURL.replace(file.actualName + '/', ''));
            } else {
              processFile(file.nativeURL);
            }
          } else {
            if (hasExtension(file.name)) {
              if (file.name.indexOf('.mp4') > 0) {
                // Stop the audio player before starting the video
                $scope.stopAudio();
                VideoPlayer.play(file.nativeURL);
              } else {
                fsResolver(file.nativeURL, function(fs) {
                  //console.log('fs ', fs);
                  // Play the selected file
                  AudioSvc.playAudio(file.nativeURL, function(a, b) {
                    //console.log(a, b);
                    $scope.position = Math.ceil(a / b * 100);
                    if (a < 0) {
                      $scope.stopAudio();
                    }
                    if (!$scope.$$phase) $scope.$apply();
                  });

                  $scope.loaded = true;
                  $scope.isPlaying = true;
                  $scope.name = file.name;
                  $scope.path = file.fullPath;

                  // show the player
                  $scope.player();

                  $scope.pauseAudio = function() {
                    AudioSvc.pauseAudio();
                    $scope.isPlaying = false;
                    if (!$scope.$$phase) $scope.$apply();
                  };
                  $scope.resumeAudio = function() {
                    AudioSvc.resumeAudio();
                    $scope.isPlaying = true;
                    if (!$scope.$$phase) $scope.$apply();
                  };
                  $scope.stopAudio = function() {
                    AudioSvc.stopAudio();
                    $scope.loaded = false;
                    $scope.isPlaying = false;
                    if (!$scope.$$phase) $scope.$apply();
                  };

                });
              }
            } else {
              $rootScope.toggle('Oops! We cannot play this file :/', 3000);
            }

          }

        }

        function fsResolver(url, callback) {
          $window.resolveLocalFileSystemURL(url, callback);
        }

        function processFile(url) {
          fsResolver(url, function(fs) {
            //console.log(fs);
            var directoryReader = fs.createReader();

            directoryReader.readEntries(function(entries) {
                if (entries.length > 0) {
                  var arr = [];
                  // push the path to go one level up
                  if (fs.fullPath !== '/') {
                    arr.push({
                      id: 0,
                      name: '.. One level up',
                      actualName: fs.name,
                      isDirectory: false,
                      isUpNav: true,
                      nativeURL: fs.nativeURL,
                      fullPath: fs.fullPath
                    });
                  }
                  processEntries(entries, arr);
                  $scope.$apply(function() {
                    $scope.files = arr;
                  });

                  $ionicScrollDelegate.scrollTop();
                } else {
                  $rootScope.toggle(fs.name + ' folder is empty!', 2000);
                }
              },
              function(error) {
                console.log(error);
              });
          });
        }

        function hasExtension(fileName) {
          var exts = ['.mp3', '.m4a', '.ogg', '.mp4', '.aac'];
          return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
        }

        function processEntries(entries, arr) {

          for (var i = 0; i < entries.length; i++) {
            var e = entries[i];

            // do not push/show hidden files or folders
            if (e.name.indexOf('.') !== 0) {
              arr.push({
                id: i + 1,
                name: e.name,
                isUpNav: false,
                isDirectory: e.isDirectory,
                nativeURL: e.nativeURL,
                fullPath: e.fullPath
              });
            }
          }
          return arr;
        }

      });
    }
  ])


  .controller('postCtrl', ['$window', '$ionicPlatform', '$rootScope', '$scope', '$ionicScrollDelegate', '$ionicModal',
    function($window, $ionicPlatform, $rootScope, $scope, $ionicScrollDelegate, $ionicModal) {
      console.log('postCtrl INIT');
      $scope.files = [];

      $ionicModal.fromTemplateUrl('templates/player.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $rootScope.hidePlayer = function() {
        $scope.modal.hide();
      };

      $rootScope.player = function() {
        $scope.modal.show();
      };

      $ionicPlatform.ready(function() {
        console.log('postCtrl READY');
        $rootScope.show('Posting!');
        /*$window.requestFileSystem($window.LocalFileSystem.PERSISTENT, 0, function(fs) {
            //console.log("fs", fs);

            var directoryReader = fs.root.createReader();

            directoryReader.readEntries(function(entries) {
                var arr = [];
                processEntries(entries, arr); // arr is pass by refrence
                $scope.files = arr;
                $rootScope.hide();
              },
              function(error) {
                console.log(error);
              });
          },
          function(error) {
            console.log(error);
          });

        $scope.showSubDirs = function(file) {

          if (file.isDirectory || file.isUpNav) {
            if (file.isUpNav) {
              processFile(file.nativeURL.replace(file.actualName + '/', ''));
            } else {
              processFile(file.nativeURL);
            }
          } else {
            if (hasExtension(file.name)) {
              if (file.name.indexOf('.mp4') > 0) {
                // Stop the audio player before starting the video
                $scope.stopAudio();
                VideoPlayer.play(file.nativeURL);
              } else {
                fsResolver(file.nativeURL, function(fs) {
                  //console.log('fs ', fs);
                  // Play the selected file
                  AudioSvc.playAudio(file.nativeURL, function(a, b) {
                    //console.log(a, b);
                    $scope.position = Math.ceil(a / b * 100);
                    if (a < 0) {
                      $scope.stopAudio();
                    }
                    if (!$scope.$$phase) $scope.$apply();
                  });

                  $scope.loaded = true;
                  $scope.isPlaying = true;
                  $scope.name = file.name;
                  $scope.path = file.fullPath;

                  // show the player
                  $scope.player();

                  $scope.pauseAudio = function() {
                    AudioSvc.pauseAudio();
                    $scope.isPlaying = false;
                    if (!$scope.$$phase) $scope.$apply();
                  };
                  $scope.resumeAudio = function() {
                    AudioSvc.resumeAudio();
                    $scope.isPlaying = true;
                    if (!$scope.$$phase) $scope.$apply();
                  };
                  $scope.stopAudio = function() {
                    AudioSvc.stopAudio();
                    $scope.loaded = false;
                    $scope.isPlaying = false;
                    if (!$scope.$$phase) $scope.$apply();
                  };

                });
              }
            } else {
              $rootScope.toggle('Oops! We cannot play this file :/', 3000);
            }

          }

        }

        function fsResolver(url, callback) {
          $window.resolveLocalFileSystemURL(url, callback);
        }

        function processFile(url) {
          fsResolver(url, function(fs) {
            //console.log(fs);
            var directoryReader = fs.createReader();

            directoryReader.readEntries(function(entries) {
                if (entries.length > 0) {
                  var arr = [];
                  // push the path to go one level up
                  if (fs.fullPath !== '/') {
                    arr.push({
                      id: 0,
                      name: '.. One level up',
                      actualName: fs.name,
                      isDirectory: false,
                      isUpNav: true,
                      nativeURL: fs.nativeURL,
                      fullPath: fs.fullPath
                    });
                  }
                  processEntries(entries, arr);
                  $scope.$apply(function() {
                    $scope.files = arr;
                  });

                  $ionicScrollDelegate.scrollTop();
                } else {
                  $rootScope.toggle(fs.name + ' folder is empty!', 2000);
                }
              },
              function(error) {
                console.log(error);
              });
          });
        }

        function hasExtension(fileName) {
          var exts = ['.mp3', '.m4a', '.ogg', '.mp4', '.aac'];
          return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
        }

        function processEntries(entries, arr) {

          for (var i = 0; i < entries.length; i++) {
            var e = entries[i];

            // do not push/show hidden files or folders
            if (e.name.indexOf('.') !== 0) {
              arr.push({
                id: i + 1,
                name: e.name,
                isUpNav: false,
                isDirectory: e.isDirectory,
                nativeURL: e.nativeURL,
                fullPath: e.fullPath
              });
            }
          }
          return arr;
        }*/

      });
    }
  ])

  /*/!*.controller('postCtrl', function ($scope, $http) {
    $scope.appName = 'Ensemble에 게시';
    $scope.postData = userInput;
    $scope.testFile;

    $scope.onClickPost = function () {
      var uploadUrl = "http://127.0.0.1:5000/postingUpload";
      var fd = new FormData();
      var len = document.getElementsByName('fileInput').length;

      console.log('postCtrl');
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
      console.log('fefwefew');
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
    }*!/
  })*/;
