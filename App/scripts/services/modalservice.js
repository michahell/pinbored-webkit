
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Modalservice
 * @description
 * # Modalservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Modalservice', 
  ['$q', 'Utilservice', 
  function ($q, Utilservice) { // $splash, 
    // AngularJS will instantiate a singleton by calling 'new' on this function

    this.alert = function (windowTitle, messageString) {

      var deferred = $q.defer();
      
      alert(messageString);
      console.log('confirmed!');
      
      // setTimeout for deferred.resolve because alerts return immediately.
      setTimeout(function(){
        deferred.resolve();
      }, 250);

      // var modalInstance = $splash.open({
      //   title: windowTitle || 'alert',
      //   message: messageString
      // }, {
      //   templateUrl: 'templates/modal-alert-content.html',
      //   windowTemplateUrl: 'templates/modal-alert-index.html'
      // });

      // modalInstance.result
      //   .then(function() {
      //     deferred.resolve();
      //   }, function() {
      //     deferred.reject();
      //   });

      return deferred.promise;
    };

    this.confirm = function (windowTitle, messageString) {

      var deferred = $q.defer();
      var isConfirmed = confirm(messageString);

      if(isConfirmed) { 
        console.log('modal confirmed!');
        deferred.resolve();
      } else {
        console.log('modal declined!');
        deferred.reject();
      }

      // var modalInstance = $splash.open({
      //   title: !Utilservice.isEmpty(windowTitle) ? windowTitle : 'Are you sure',
      //   message: messageString
      // }, {
      //   templateUrl: 'templates/modal-confirm-content.html',
      //   windowTemplateUrl: 'templates/modal-confirm-index.html'
      // });

      // modalInstance.result
      //   .then(function() {
      //     deferred.resolve();
      //   }, function() {
      //     deferred.reject();
      //   });

      return deferred.promise;
    };

  }]);
