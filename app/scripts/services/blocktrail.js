'use strict';

angular.module('scratchApp')
    .factory('blocktrail', [ function() {

        var endpoint = "https://api.blocktrail.com/v1/tBTC";

        return {
            createWallet: function(){alert('createWalled called')}
        };
    }]);