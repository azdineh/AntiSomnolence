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
     * @param scope
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

    /**
     * @param begin_hour nulber as  '3' or '14'
     * @param end_hour number as '2' or '6'
     */
    vm.readAdviceInTime = function (begin_hour, end_hour, scope) {
      var begin_unix_time;
      var end_unix_time;

      var datenow = new Date();
      datenow.setHours(begin_hour);
      begin_unix_time = datenow.getTime();
      datenow.setHours(end_hour);
      end_unix_time = datenow.getTime();

      //console.log("End - Begin = "+(end_unix_time-begin_unix_time)/(1000*60*60));
      begin_unix_time = Date.now() + (1000 * 6);
      end_unix_time = begin_unix_time + (1000 * 14);

      var adviceInTimeTaske;
      scope.$watch('current_unix_time', function (recent_unix_time) {
        var d_begin = Math.abs(begin_unix_time) - Math.abs(recent_unix_time);
        var d_end = Math.abs(end_unix_time) - Math.abs(recent_unix_time);

        if (Math.abs(d_begin) < 500) {
          console.log("Begin advice in time");
          adviceInTimeTaske = $interval(function () {
            // read an advice sound
            console.log("read advice sound");
          }, 2000); // each 7 minuts
        }
        if (Math.abs(d_end) < 500) {
          console.log("End advice reding time");
          $interval.cancel(adviceInTimeTaske);
        }
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
