angular.module('scratchApp')
  .controller('MenuCtrl', function ($scope, $location) {
    $scope.showHeader = function() {
        var result = $location.path().indexOf("pizza") < 0;
        return result;
    }
    $scope.isActive = function(path) {
        if ($location.path().substr(0, path.length) == path) {
          return "active"
        } else {
          return ""
        }
    }
  });