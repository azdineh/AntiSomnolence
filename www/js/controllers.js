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
  .controller('MbreakerCtrl', function ($scope, $rootScope, $interval,smbreaker) {

    $scope.slidesOptions = {
      loop: false,
      speed: 250,
      pagination: false
    };

    $rootScope.waitedDelay = 1*1000*60; //tow minuts
    $rootScope.frequencePulse = 0.5*1000*60; // time between excitations
    $rootScope.enableAdvice = false;
    $scope.currentSS = "";
    $scope.timerSecond = 59;
    $scope.timerMinut = $rootScope.waitedDelay / 60000;

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
    $scope.d=Date.now();

    var bootfunc=$interval(function(){
      $scope.d0=Date.now();
    },1000);

    $scope.$watch('d0',function(d1){
      console.log("now :"+d1);
      if(Math.abs(d1-(Math.abs($scope.d)+Math.abs($rootScope.waitedDelay)))<500){
        console.log("Start breaking now..");
        smbreaker.startSoundMonotonyBreaking($rootScope.waitedDelay,$rootScope.frequencePulse,$rootScope.enableAdvice,$scope);
        $interval.cancel(bootfunc);
      }
    },true);

    $scope.$on('$destroy', function () {
      smbreaker.stopBreaking();
    });





  })
  .controller('CarCtrl', function ($scope) { })
  .controller('UserCtrl', function ($scope) { })
  .controller('SettingsCtrl', function ($scope) { });
