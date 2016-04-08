(function(){
  'use strict';

  var appInjects = [];
  var controllerInjects = [
    '$http'
  ];

  function HomeCtrl($http){
    var self = this;

    self.email = {};

    function sendEmail(){
      $http.post('/email', {
        email: self.email
      }).then(function(){
        swal("Email Sent", "Your email was successfully sent!", "success");
      }, function(){
        swal("Email Not Sent", "Your email was not succesfully sent!", "error");
      });
    }

    self.sendEmail = sendEmail;
  }

  var app = angular.module('melliotfrost', appInjects);

  HomeCtrl.$inject = controllerInjects;

  app.controller('HomeCtrl', HomeCtrl);

  angular.element(document).ready(function(){
    angular.bootstrap(document, ['melliotfrost']);
  });
}());
