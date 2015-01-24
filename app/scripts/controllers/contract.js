'use strict';

angular.module('scratchApp')
    .controller('ContractCtrl', function ($scope, $http, $location) {
        var serversPublicKey,
            wallet,
            paymentTx,
            refundTx,
            signedTx;

        $scope.generate = function () {
            getServersPublicKey($scope.walet_publicKey);

            signTransactionAtServer();
        }

        function getServersPublicKey(clientsPublicKey) {
            var req = {
                method: 'POST',
                url: 'http://0.0.0.0:3000/wallet/create',
                headers: {
                  'Content-Type': 'application/json'
                },
                data: {
                    userPublicKey:"026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01"
                }
            };

            $http(req).success(function (data, status, headers, config) {

                console.log("Server responded with key: " + data);
                serversPublicKey = data;
                createTransactions($scope.wallet_amount, $scope.wallet_duration);
                }).error(function (data, status, headers, config) {
                    $location.path('/');
                });
            serversPublicKey = "ServersPublicKey";
        }

        function createTransactions(amount, duration) {
            // generate wallet

            // create payment transaction

            // create refund transaction
        }

        function signTransactionAtServer() {
            signedTx = "signed transaction";
        }
    });
