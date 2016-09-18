var app = angular.module('codecraft', [
	'ngResource',
	'infinite-scroll'
	]);

//Com esse token eu irei autenticar todas minhas requisições http (requisito desta API, lembrando que a API é definida pela aplicação servidor).
app.config(function($httpProvider, $resourceProvider) {
	$httpProvider.defaults.headers.common['Authorization'] = 'Token 443a8c5e2d86929c42058d32de6b3ee9324a295c';	
	$resourceProvider.defaults.stripTrailingSlashes = false;
});

//Injeta o resultado da consulta em Contact
app.factory("Contact", function($resource){
	return $resource("https://codecraftpro.com/api/samples/v1/contact/:id/");
});


app.controller('PersonDetailController', function ($scope, ContactService) {
	$scope.contacts = ContactService;
});


app.controller('PersonListController', function ($scope, ContactService) {

	$scope.search = "";
	$scope.order = "email";
	$scope.contacts = ContactService;

	$scope.loadMore = function () {
		console.log("load more!");
	};

	$scope.sensitiveSearch = function(person) {
		if ($scope.search) {
			return person.name.indexOf($scope.search) == 0 ||
				     person.email.indexOf($scope.search) == 0;
		}
		return true;
	};
});

app.service('ContactService', function(Contact) {
	
	var self = {
		'addPerson' : function (person){
			this.persons.push(person);
		},
		'page' : 1,
		'hasMore' : true,
		'isLoading' : false,
		'selectedPerson' : null,
		'persons' : [],
		'loadContacts' : function () {
			Contact.get(function(data){
				console.log(data);
				angular.forEach(data.results, function (person) {
					self.persons.push(new Contact(person));
				});
			});
		}
	};

	self.loadContacts();

	return self;
});
