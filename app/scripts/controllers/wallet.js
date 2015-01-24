'use strict';

angular.module('scratchApp')
  .controller('WalletCtrl', function ($scope) {
    $scope.transactions = [
        {
            amount: '1 BTC',
            description: 'Initial deposition',
        }
    ];
  });