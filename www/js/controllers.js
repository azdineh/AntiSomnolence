angular.module('starter.controllers', [])
  .controller('HomeCtrl', function ($scope) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    //$scope.chat = Chats.get($stateParams.chatId);
  })
  .controller('MbreakerCtrl', function ($scope, $rootScope, $interval, smbreaker) {

    $scope.slidesOptions = {
      loop: false,
      speed: 250,
      pagination: false
    };

    $rootScope.frequencePulse = $rootScope.frequencePulse || (0.5 * 1000 * 60); // time between excitations
    $rootScope.waitedDelay = $rootScope.waitedDelay || ((1 * 1000 * 60) - $rootScope.frequencePulse);
    $rootScope.enableAdvice = false;

    $scope.currentSS = "";
    $scope.timerSecond = 59;
    $scope.timerMinut = $rootScope.waitedDelay / 60000;

    $scope.ishiden = true;

    smbreaker.readAdviceInTime(14, 17, $scope);

    //var t=0;
    /*var count = $rootScope.waitedDelay / 1000;
    $interval(function () {
      if ($scope.timerSecond === 0) {
        $scope.timerMinut=$scope.timerMinut-1;
        $scope.timerSecond = 59;
      }
      else {
        $scope.timerSecond = Math.abs($scope.timerSecond - 1);
      }

    }, 1000, count);*/

    if (ionic.Platform.isWebView() === false) {
      $scope.d = Date.now();
      var i = 0;
      var globalTimer = $interval(function () {
        $scope.current_unix_time = Date.now();
        if (i % 2 == 0)
          $scope.ishiden = true;
        else
          $scope.ishiden = false;
        i++;
      }, 1000);

      //cordova.plugins.backgroundMode.enable();
      //cordova.plugins.backgroundMode.onactivate=function(){};
      $scope.$watch('current_unix_time', function (d1) {
        console.log("now :" + d1);
        if (Math.abs(d1 - (Math.abs($scope.d) + Math.abs($rootScope.waitedDelay))) < 500) {
          console.log("Start breaking now..");
          smbreaker.startSoundMonotonyBreaking($rootScope.waitedDelay, $rootScope.frequencePulse, $rootScope.enableAdvice, $scope);
          //$interval.cancel(globalTimer);
        }
      }, true);

      $scope.$on('$destroy', function () {
        smbreaker.stopBreaking();
      });



    }

  })
  .controller('CarCtrl', function ($scope) {

  })
  .controller('UserCtrl', function ($scope) { })
  .controller('SettingsCtrl', function ($scope, $rootScope, $localStorage) {



    $scope.settings = {};
    $scope.settings.waitedDelay = $localStorage.settings.waitedDelay || 10;
    $scope.settings.frequencePulse = $localStorage.settings.frequencePulse || 3;

    if (angular.isDefined($localStorage.settings.enableAdvice)) {
      $scope.settings.enableAdvice = $localStorage.settings.enableAdvice;
    }
    else {
      $scope.settings.enableAdvice = true;
    }

    $scope.style_for_settings_container = "settings-container-disabled";
    $scope.event_name = "Editer";

    $scope.editAndSaveSettings = function () {
      if ($scope.event_name == "Editer") {
        $scope.style_for_settings_container = "settings-container";
        $scope.event_name = "Enregistrer";
      }
      else {
        $scope.style_for_settings_container = "settings-container-disabled";
        $scope.event_name = "Editer";
      }

      $scope.waitedDelay = $scope.settings.waitedDelay;
      $scope.frequencePulse = $scope.settings.frequencePulse;
      $scope.enableAdvice = $scope.settings.enableAdvice;

      $localStorage.settings = $scope.settings;
    };

  });
