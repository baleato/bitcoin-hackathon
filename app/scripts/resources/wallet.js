'use strict';

angular.module('scratchApp')
    .factory('Wallet', ['$resource', function($resource) {
        var endPoint = '0.0.0.0:3000';
        return $resource(endPoint + '/wallet/:id', null, null);
    }]);