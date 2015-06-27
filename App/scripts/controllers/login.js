
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('LoginCtrl', 
    ['$scope', '$controller', '$location', '$timeout', 'Usersessionservice', 'Pinboardservice', 'Modalservice', 
    'Utilservice', 
    function ($scope, $controller, $location, $timeout, Usersessionservice, Pinboardservice, Modalservice, 
      Utilservice) {
    
    // Initialize the super (controller) class and extend it.
    angular.extend(this, $controller('BaseViewCtrl', {$scope: $scope}));

    $scope.busy = false;
    $scope.loginAnimation = null;
    $scope.connection = false;
    $scope.username = '';
    $scope.password = '';

    $scope.loginEnter = function(keyEvent) {
      if (keyEvent.which === 13) {
        $scope.login($scope.username, $scope.password);
      }
    };

    $scope.getUserToken = function (username, password) {
      Pinboardservice.getUserToken(username, password)
      .then(function(result) {
          if (result) {
            console.log('result: ', result);
            // Unauthorized
            if(Number(result) === 401) {   // a number indicates we failed, no login...
              console.info('not logged in: ' + result);
              $scope.loginAnimation = false;
            // Service Unavailable
            } else if(Number(result) >= 500 && Number(result) <= 510) {
              console.log('service unavailable.');
            // Authorized (request success)
            } else if(result != {} && result.result.length === 20) { // now we get a string token back, OMGtyping.
              console.info('logged in.');
              // set some stuff in Usersessionservice
              Usersessionservice.setAuthenticated($scope.username, result.result);
              // show loginbox outro anim
              $scope.loginAnimation = true;
              // reroute to main after anim out time
              $timeout(function() {
                $location.path('/overview');
              }, 1000);
            }
          }
          
          // reset status vars
          $scope.busy = false;
          $timeout(function() {
            $scope.loginAnimation = null;
          }, 1000);

          // show failure reason
        }, function(reason) {
          console.error('Failed: ' + reason);
        });
    };

    $scope.login = function(username, password) {

      $scope.busy = true;

      if(!Utilservice.isEmpty(username) && !Utilservice.isEmpty(password)) {

        if(username !== 'offline' && password !== 'offline') {
          Pinboardservice.checkConnection()
          .then(function(result) {
            console.log(result);
            $scope.getUserToken(username, password);
          }, function(failure) {
            console.log(failure);
            Modalservice.confirm('No internet connection', 'It seems there is no internet connection. Retry (OK) or go offline (cancel) ?')
            .then(function() {
              // retry login
              $scope.login($scope.username, $scope.password);
            }, function() {
              // cancelled
              $scope.login('offline', 'offline');
            });
          });
        } else {
          // offline mode!
          
        }
      } else {
        // todo error no input
        Modalservice.alert('Insufficient input', 'Please fill out both username and password.');
      }

    };

    $scope.$on("$destroy", function() {
      console.info('login $destroy called');
    });

  }]);
