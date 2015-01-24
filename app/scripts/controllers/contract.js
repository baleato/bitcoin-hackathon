'use strict';

angular.module('scratchApp')
    .controller('ContractCtrl', function ($scope) {
        var serversPublicKey,
            wallet,
            paymentTx,
            refundTx,
            signedTx;

        $scope.generate = function () {
            step1_getServersPublicKey($scope.walet_publicKey);
            step2_createTransactions($scope.wallet_amount, $scope.wallet_duration);
            step3_signTransactionAtServer();
        }

        function step1_getServersPublicKey(clientsPublicKey) {
            alert(clientsPublicKey);
            serversPublicKey = "ServersPublicKey";
        }

        function step2_createTransactions(amount, duration) {
            // generate wallet

            // create payment transaction

            // create refund transaction
        }

        function step3_signTransactionAtServer() {
            signedTx = "signed transaction";
        }
});