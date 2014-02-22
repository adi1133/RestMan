var RestMan = angular.module("RestMan", ["ui.bootstrap", "ui.sortable"]);
RestMan.controller("MainCtrl", ["$scope",
	function($scope) {
		console.log("controller started");
		$scope.manifest = chrome.runtime.getManifest();

		$scope.list = ["one", "two", "thre", "four", "five", "six"];

		$scope.method = "HEAD";
		$scope.send = function() {
			console.log($scope.url);
			query($scope.url);
		}

		$scope.query = [{
			name: "a",
			value: "b"
		}, {
			name: "a",
			value: "b"
		}, {
			name: "a",
			value: "b"
		}, {
			name: "a",
			value: "b"
		}];

		$scope.$watch("query", processList, true);

		function processList(list) {
			console.log("run");
			for (var i = 0; i < list.length;) {
				var current = list[i];
				if (!current.name && !current.value) {
					list.splice(i, 1);
				} else {
					i++;
				}
			}
			list.push({});
		}

		$scope.jquery = $().jquery;
		$scope.headers = [1, 2, 3, 4];
		$scope.url = "http://www.google.com";

		function query() {
			$.ajax({
				url: $scope.url,
				type: $scope.method,
				data: $scope.query,
				complete: function(xhr, status) {
					console.log(xhr);
					console.log(status);
					$scope.headers = getHeaders(xhr);
					$scope.$apply();
				}
			});
		}

		function getHeaders(xhr) {
			var headersRegex = /^(.*?):[ \t]*([^\r\n]*)$/mg;
			var headersStr = xhr.getAllResponseHeaders();
			var retObj = {};
			if (!headersStr)
				return retObj;
			while (true) {
				var match = headersRegex.exec(headersStr);
				if (!match)
					return retObj;
				retObj[match[1].toLowerCase()] = match[2];
			}
		}

	}
]);