var RestMan = angular.module("RestMan", ["ngRoute", "ui.bootstrap", "ui.sortable", "ui.codemirror"]);

RestMan.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'index.html',
		controller: 'MainCtrl'
	}).when('/query:data', {
		templateUrl: 'partials/phone-detail.html',
		controller: 'PhoneDetailCtrl'
	}).otherwise({
		redirectTo: '/'
	});
}]);