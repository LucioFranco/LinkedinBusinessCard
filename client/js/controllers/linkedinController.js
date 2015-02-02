var app = angular.module('linkedinApp', ['ngResource', 'ngRoute']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'subviews/index.html',
            controller: 'HomeController'
        }).when('/me', {
            templateUrl: 'subviews/me.html',
            controller: 'MeController'
        }).otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeController', ['$scope', '$http',
    function($scope, $http) {

}]);

app.controller('MeController', ['$scope', '$http',
    function($scope, $http) {
        $http.get('api/getme').success(function(data) {
            $scope.firstName = data.firstName;
            $scope.lastName = data.lastName;
        });
}]);
