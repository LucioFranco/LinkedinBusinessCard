var app = angular.module('linkedinApp', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        //TODO fix routing for html5
        //$locationProvider.html5Mode(true);
        $routeProvider.when('/', {
            templateUrl: 'subviews/index.html',
            controller: 'HomeController'
        }).when('', {
            templateUrl: 'subviews/index.html',
            controller: 'HomeController'
        }).when('/me', {
            templateUrl: 'subviews/me.html',
            controller: 'MeController'
        }).when('/login', {
            templateUrl: 'subviews/login.html',
            controller: 'LoginController'
        }).otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeController', ['$scope', '$http',
    function($scope, $http) {
        $http.get('api/getme').success(function(data) {
            if(!data.linkedinid) {
                $scope.alerts = [
                    { type: 'danger', msg: "It looks like you are not logged in. Please loggin via Linkedin at the above link"}
                ];
            }
        });

}]);

app.controller('LoginController', ['$scope', '$http',
    function($scope, $http) {

}]);


app.controller('MeController', ['$scope', '$http',
    function($scope, $http) {
        $http.get('api/getme').success(function(data) {
            $scope.firstName = data.firstName;
            $scope.lastName = data.lastName;
        });
}]);
