(function(){
  'use strict';

  var appInjects = [
   'angular-stripe'
  ];
  var controllerInjects = [
    '$http',
    '$scope',
    'stripe'

  ];
  var configInjects = [
    'stripeProvider'
  ];

  function HomeCtrl($http, $scope, stripe){
    var self = this;

    self.email = {};
    self.donate = {
      card: {}
    };
    self.activeDonate = 'select';

    function sendEmail(){
      $http.post('/email', {
        email: self.email
      }).then(function(){
        swal("Email Sent", "Your email was successfully sent!", "success");
        self.email = {};
      }, function(){
        swal("Email Not Sent", "Your email was not succesfully sent!", "error");
      });
    }

    function selectAmount(amount){
      self.donate.amount = amount;
      self.activeDonate = "payment";
    }

    function donation(){
      swal({   
        title: "Confirmation",   
        text: "Confirming that you would like to donate $" + self.donate.amount + ". Is that correct?" ,
        type: "info",  
        showCancelButton: true,   
        confirmButtonText: "Yes!",   
        cancelButtonText: "Not sure yet.",
        closeOnConfirm: false,   
        closeOnCancel: true,
        showLoaderOnConfirm: true
      }, function(isConfirm){   
        if (isConfirm) {  
          stripe.card.createToken(self.donate.card).then(function(response){  
            $http.post('/donation', {
              donation: {
                amount: self.donate.amount,
                token: response.id
              }
            }).then(function(rep){
              $('.close').click();
              self.activeDonate = 'select';
              self.donate = {};
              swal({
                title: "Donated!",
                text: "Thank you so much for your contribution!", 
                type: "success",
              }, function(){
                $scope.$apply();
              });
            });
          });
        } 
      });
    }

    self.sendEmail = sendEmail;
    self.selectAmount = selectAmount;
    self.donation = donation;
  }

  function directive(){
    return {
      restrict: 'C',
      scope: {
        id: '='
      },
      link: function(scope, el){
        $(el).material_select();
      }
    };
  }

  function inputmask(){
    return {
      restrict: 'A',
      scope: {
        inputmask: '='
      },
      link: function(scope, el){
        console.log(scope.inputmask);
        $(el).inputmask(scope.inputmask);
      }
    };
  }

  function config(stripeProvider){
    stripeProvider.setPublishableKey('pk_live_mUxS9XPhsGlL8InWe5ypX2iv');
  }

  var app = angular.module('melliotfrost', appInjects);

  HomeCtrl.$inject = controllerInjects;
  config.$inject = configInjects;

  app.controller('HomeCtrl', HomeCtrl);
  app.directive('select', directive);
  app.directive('inputmask', inputmask);
  app.config(config);

  angular.element(document).ready(function(){
    angular.bootstrap(document, ['melliotfrost']);
  });
}());
