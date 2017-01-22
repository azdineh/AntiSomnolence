angular.module('starter.controllers', [])
.controller('HomeCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  //$scope.chat = Chats.get($stateParams.chatId);
})
.controller('MbreakerCtrl',function($scope){})
.controller('CarCtrl',function($scope){})
.controller('UserCtrl',function($scope){})
.controller('SettingsCtrl',function($scope){});
