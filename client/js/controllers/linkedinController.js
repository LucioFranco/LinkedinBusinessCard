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
        }).when('/card', {
            templateUrl: 'subviews/card.html',
            controller: 'CardController'
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

        function updateFromBackEnd() {
            $scope.me = me;
            $scope.cards = cards;
        }
        var cards;
        var me = $http.get('/api/getme').success(function(pro) {
            //console.log(pro);
            cards = $http.get('/api/cards/' + me.linkedinid).success(function(data) {
                console.log('pro '+ pro);
                if(true) {
                    data[0] = {
                        linkedinid: pro.linkedinid,
                        formattedName: pro.formattedName,
                        email: pro.email,
                        website: pro.website,
                        phoneNumber: pro.phoneNumber,
                        location: pro.location,
                        healine: pro.headline,
                        pictureUrl: pro.pictureUrl,
                        cardTitle: 'New Buisness Card!'
                    };

                }
                console.log(data);
                $scope.cards = data;
                return data;
            });
            return pro;
        });


        $scope.save = '';
        var setSave = function(data) {
            $scope.save = data;
        };

        $scope.onSave = function() {

            var cards = $scope.cards;
            console.log(cards);
            for(var i = 0; i < cards.length; i++) {
                var text = '/api/savecard/' + cards[i].id + '/'+ me.linkedinid + '/' + cards[i].formattedName + '/' + cards[i].email + '/' + cards[i].website + '/' + cards[i].phoneNumber + '/' + cards[i].location + '/' + cards[i].headline + '/' + cards[i].pictureUrl + '/' + cards[i].title;
                console.log(text);
                $http.get(text).success(setSave);
            }
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

app.controller('CardController', ['$scope', '$http', '$rootScope', '$window',
    function($scope, $http, $rootScope, $window) {

        auth($rootScope, $http, $window);

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


app.controller('MeController', ['$scope', '$http', '$rootScope', '$window',
    function($scope, $http, $rootScope, $window) {

        auth($rootScope, $http, $window);

        $http.get('api/getme').success(function(data) {
            $scope.firstName = data.firstName;
            $scope.lastName = data.lastName;
        });
}]);
