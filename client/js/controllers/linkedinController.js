var app = angular.module('linkedinApp', ['ngResource', 'ngRoute', 'xeditable', 'ui.bootstrap']);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'subviews/home.html',
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
        }).when('/card', {
            templateUrl: 'subviews/card.html',
            controller: 'CardController'
        }).otherwise({
            redirectTo: '/'
        });
}]);

function login($rootScope, $http) {
    $http.get('/isloggedin').success(function(data) {
        if(data.isloggedin === 'true') {
            $rootScope.login = 'Logout';
            $rootScope.loginurl = 'logout';
        }else {
            $rootScope.login = 'Login';
            $rootScope.loginurl = '#/login';
        }
    });
}

app.controller('HomeController', ['$scope', '$http', '$rootScope',
    function($scope, $http, $rootScope) {

        login($rootScope, $http);

        $http.get('api/getme').success(function(data) {
            if(!data.linkedinid) {
                $scope.alerts = [
                    { type: 'danger', msg: "It looks like you are not logged in. Please loggin via Linkedin at the above link"}
                ];
            }
        });

}]);

app.controller('LoginController', ['$scope', '$http', '$rootScope',
    function($scope, $http, $rootScope) {
        login($rootScope, $http);
}]);

app.controller('CardController', ['$scope', '$http', '$rootScope',
    function($scope, $http, $rootScope) {

        login($rootScope, $http);

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


app.controller('MeController', ['$scope', '$http', '$rootScope',
    function($scope, $http, $rootScope) {

        login($rootScope, $http);

        $http.get('api/getme').success(function(data) {
            $scope.firstName = data.firstName;
            $scope.lastName = data.lastName;
        });
}]);
