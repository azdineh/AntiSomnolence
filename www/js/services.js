angular.module('starter.services', [])

  .factory('Chats', function () {
    var x = 0;
    return {
      X: x
    };
  })
  // Implentation of sound monotony breaker
  .factory('smbreaker', function ($interval, $timeout, $http, $q, $cordovaNativeAudio) {

    var vm = {};
    /**
     * @description SS for ShortSound is an json object like {id:'zedge',name:'zedge.mp3'} 
     */
    var SS = function (id, name, type) {
      var that = {};
      that.id = id;
      that.name = name;
      that.type = type;

      return that;
    };

    var SSarray = [];

    /**
     * @param url like sound/shortsounds.json
     */
    var fillSSarrayfromJsonFile = function (url) {
      var q = $q.defer();
      var urlsuffix = "";

      if (ionic.Platform.isAndroid()) {
        urlsuffix = "/android_asset/www/";
      }

      $http.get(urlsuffix + url)
        .then(function (res) {
          q.resolve(res.data.shortsounds);
        }, function (err) {
          console.log("Error while getting resources..");
          q.reject(err);
        });

      return q.promise;
    };

    /**
     * @param SSobject 
     */
    var playSS = function (SSobject, scope) {
      var path = "sound/SS/";
      if (SSobject.type == 'ssa') { path = 'sound/SSAdvice/'; }

      $cordovaNativeAudio
        .preloadComplex(SSobject.id, path + SSobject.name + '.mp3', 1, 1)
        .then(function (msg) {

          if (SSobject.type == 'SS')
            console.log('Short sound is prelaoded successfully..');
          else
            console.log('Short sound advice is prelaoded successfully..');

          //$cordovaNativeAudio.loop(SSobject.id);
          $cordovaNativeAudio.play(SSobject.id, function () {
            console.log("End playing of : " + SSobject.name);
            $cordovaNativeAudio.unload(SSobject.id);
          }, function () { }, function () { });

        }, function (error) {
          console.log('Error ' + error + ' while preloading this sound ' + SSobject.name + '.mp3');
        });
    };

    var i = 0;
    var startingPromise;
    /**
     * @param time_between_excitation number of milliseconds
     * @param ifadvice boolean for enable short advice sounds 
     */
    vm.startSoundMonotonyBreaking = function (waited_delayy, time_between_excitation, ifadvice, scope) {
      var advice = ifadvice || false;
      var waited_delay = waited_delayy || 120000; // tow minuts
      var tbe = time_between_excitation || 3000; // tbe from time_between_excitation;



      fillSSarrayfromJsonFile("sound/shortsounds.json")
        .then(function (array) {
          SSarray = array;
          var ssCount = SSarray.length;
          var y = 1, x = 1;

          startingPromise = $interval(function () {

            while (x == y || (SSarray[y].type == "ssa") && !ifadvice) {
              y = Math.floor(Math.random() * ssCount);
            }

            console.log("excitation : y = " + y + " " + SSarray[y].name + " type : " + SSarray[y].type); i++;
            x = y;

            scope.currentSS = SSarray[y].name;
            // play a random SS 
            playSS(SSarray[y], scope);

          }, tbe);





        }, function (err) {

        });

    };

    vm.stopBreaking = function () {
      if (angular.isDefined(startingPromise)) {
        $interval.cancel(startingPromise);
        startingPromise = undefined;
      }
    };


    return vm;
  });
