'use strict';

/**
 * @ngdoc overview
 * @name scratchApp
 * @description
 * # scratchApp
 *
 * Main module of the application.
 */
angular
  .module('scratchApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/wallet', {
        templateUrl: 'views/wallet.html',
        controller: 'WalletCtrl'
      })
      .when('/contract', {
          templateUrl: 'views/contract.html',
          controller: 'ContractCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
