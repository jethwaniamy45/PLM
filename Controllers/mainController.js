
var app = angular
		.module("myApp", [ "angular.filter", "ngRoute", "datatables" ]);

//Routing for application
app.config(function($routeProvider) {
	$routeProvider.when("/ApplicationsView", {
		templateUrl : "views/ApplicationsView.html",
		controller : "MyCtrl"
	}).when("/BuildsView", {
		templateUrl : "views/BuildsView.html",
		controller : "BuildCtrl"
	}).when("/Info", {
		templateUrl : "views/Info.html",
		controller : "InfoCtrl"
	}).when("/", {
		templateUrl : "views/ApplicationsView.html",
		controller : "MyCtrl"
	})

});

//factory service for export functionallity
app
		.factory(
				'Excel',
				function($window) {
					var uri = 'data:application/vnd.ms-excel;base64,', template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>', base64 = function(
							s) {
						return $window.btoa(unescape(encodeURIComponent(s)));
					}, format = function(s, c) {
						return s.replace(/{(\w+)}/g, function(m, p) {
							return c[p];
						})
					};
					return {
						tableToExcel : function(tableId, worksheetName) {
							var table = $(tableId), ctx = {
								worksheet : worksheetName,
								table : table.html()
							}, href = uri + base64(format(template, ctx));
							return href;
						}
					};
				})

//Controller for ApplicationsView Page
app.controller('MyCtrl', function($scope, $http, $rootScope) {

	$http.get("data/PLM_BUILD_METRICS.json").then(function(response) {
		$scope.myWelcome = response.data;

	});

	$rootScope.setApplication = function(testData) {

		$http.get("data/PLM_ENV_BUILD_INFO.json").then(function(response) {
			$rootScope.myPLMData = response.data;

		});

		console.log("succsess");
		console.log("Application:" + $rootScope.application)
		$rootScope.application = testData;

	}

	$scope.setEnvironment = function(testData) {

		$rootScope.env = testData;

	}

});



//Controller for Tables Summary Page
app.controller('InfoCtrl',
		function($scope, $http, $rootScope, Excel, $timeout) {

			$scope.exportToExcel = function(tableId) { // ex: '#my-table'
				$scope.exportHref = Excel.tableToExcel(tableId, 'sheet name');
				$timeout(function() {
					location.href = $scope.exportHref;
				}, 100); // trigger download
			}

			
			$http.get("data/PLM_ENV_BUILD_INFO.json").then(function(response) {
				$scope.myPLMData1 = response.data;

			});

			$http.get("data/PLM_BUILD_METRICS.json").then(function(response) {
				$scope.historyData = response.data;

			});

		});

