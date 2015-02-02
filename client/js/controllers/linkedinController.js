var app = angular.module('linkedinApp', ['ngResource', 'ngRoute', 'xeditable', 'ui.bootstrap']);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
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
        }).when('/logout', {
            templateUrl: 'subviews/logout.html',
            controller: 'LogoutController'
        }).when('/card', {
            templateUrl: 'subviews/card.html',
            controller: 'CardController'
        }).otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeController', ['$scope', '$http',
    function($scope, $http) {
        $http.get('api/getme').success(function(data) {
            if(!data.linkedinid) {
                //FIXME fix ui.bootstrap stuff
                $scope.alerts = [
                    { type: 'danger', msg: "It looks like you are not logged in. Please loggin via Linkedin at the above link"}
                ];
            }
        });

}]);

app.controller('LoginController', ['$scope', '$http',
    function($scope, $http) {

}]);

app.controller('LogoutController', ['$scope', '$http',
    function($scope, $http) {

}]);

app.controller('CardController', ['$scope', '$http',
    function($scope, $http) {
        $http.get('api/getme').success(function(data) {
            $scope.formattedName = data.formattedName;
            $scope.headline = data.headline;
            $scope.email = data.email;
            $scope.phoneNumber = data.phoneNumber;
            $scope.location = data.location;
            $scope.pictureUrl = data.pictureUrl;
            $scope.website = data.website;
        });
}]);


app.controller('MeController', ['$scope', '$http',
    function($scope, $http) {
        $http.get('api/getme').success(function(data) {
            $scope.firstName = data.firstName;
            $scope.lastName = data.lastName;
        });
}]);
