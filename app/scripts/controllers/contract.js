'use strict';

angular.module('scratchApp')
    .controller('ContractCtrl', function ($scope, $http, $location, PaymentChannel) {
        var serversPublicKey,
            wallet,
            paymentTx,
            refundTx,
            signedTx;
        var redeemScript, multisigAddress;
        var clientPrivateKey = "1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK";

        $scope.generate = function () {
            getServersPublicKey($scope.walet_publicKey);

            signTransactionAtServer();
        };

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
                createTransactions($scope.wallet_amount, $scope.wallet_duration, $scope.wallet_transactionId);
                }).error(function (data, status, headers, config) {
                    $location.path('/');
                });
            serversPublicKey = "ServersPublicKey";
        }

        function createTransactions(amount, duration, txId) {
            // create address
            redeemScript = PaymentChannel.create_multisignature_address(serversPublicKey, "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01" );
            multisigAddress = PaymentChannel.get_multisig_address_from_redeem_script(redeemScript);
            // generate wallet

            // create payment transaction
            PaymentChannel.create_and_sign_funding_transaction(clientPrivateKey, txId, redeemScript, amount);
            // create refund transaction
        }

        function signTransactionAtServer() {
            signedTx = "signed transaction";
        }
    });
