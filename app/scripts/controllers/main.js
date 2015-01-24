'use strict';

/**
 * @ngdoc function
 * @name scratchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the scratchApp
 */
angular.module('scratchApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });