var app = angular.module('linkedinApp', ['ngResource', 'ngRoute', 'xeditable', 'ui.bootstrap']);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'subviews/home.html',
            controller: 'HomeController'
        }).when('/me', {
            templateUrl: 'subviews/me.html',
            controller: 'MeController'
        }).when('/login', {
            templateUrl: 'subviews/login.html',
            controller: 'LoginController'
        }).when('/cards', {
            templateUrl: 'subviews/cards.html',
            controller: 'CardsController'
        }).otherwise({
            redirectTo: '/'
        });
}]);

//////////HELPER FUNCTIONS /////////////
function login($rootScope, $http) {
    var auth;
    return $http.get('/isloggedin').success(function(data) {
        if(data.isloggedin === 'true') {
            $rootScope.login = 'Logout';
            $rootScope.loginurl = 'logout';
            return true;
        }else {
            $rootScope.login = 'Login';
            $rootScope.loginurl = '#/login';
            return false;
        }
    });
}

function auth($rootScope, $http, $window) {
    var log = login($rootScope, $http);
    if(!log) {
        $window.location.href = '/';
    }
}


///////////PAGE CONTROLLERS////////////////
app.controller('CardsController', ['$scope', '$http', '$rootScope', '$window',
    function($scope, $http, $rootScope, $window) {
        auth($rootScope, $http, $window);

        var me = $http.get('/api/getme').success(function(result) {
            $scope.me = result;
            return result;
        });

        $scope.onSave = function() {
            $http.post('/api/save/' + $scope.me.linkedinid, { cards: $scope.me.cards });
            $window.location.href = '/#/cards';
            /* TODO fix save alert
            $scope.alerts = [
                { type: 'danger', msg: "It looks like you are not logged in. Please loggin via Linkedin at the above link"}
            ];
            */
        };

        $scope.onNewCard = function() {
            $scope.me.cards.push({
                'linkedinid': $scope.me.linkedinid,
                'formattedName': $scope.me.formattedName,
                'email': $scope.me.email,
                'website': 'http://example.com',
                'phoneNumber': $scope.me.phoneNumber,
                'location': $scope.me.location,
                'headline': $scope.me.headline,
                'pictureUrl': $scope.me.pictureUrl,
                'cardTitle': 'New Card'
            });
        };


}]);


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

app.controller('MeController', ['$scope', '$http', '$rootScope', '$window',
    function($scope, $http, $rootScope, $window) {

        auth($rootScope, $http, $window);

        $http.get('api/getme').success(function(data) {
            $scope.firstName = data.firstName;
            $scope.lastName = data.lastName;
        });
}]);
