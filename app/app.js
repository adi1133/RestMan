var RestMan = angular.module("RestMan", ["ngRoute", "ui.bootstrap", "ui.sortable", "ui.codemirror"]);

RestMan.config(['$routeProvider', "$locationProvider", function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'view/main.html',
		controller: 'MainCtrl'
	}).when('/query/:data', {
		templateUrl: 'view/query.html',
		controller: 'QueryCtrl'
	}).otherwise({
		redirectTo: '/'
	});
	//$locationProvider.html5Mode(true);
}]);