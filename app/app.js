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

		$scope.protocol = "http";
		$scope.host = "www.google.ro";

		(function() {
			var watchQuery;
			var watchUrl;
			var watchProtocol;
			var watchHost;
			$scope.focus = {
				query: function() {
					if (!watchQuery)
						watchQuery = $scope.$watch("query", processList, true);
					if (watchUrl) {
						watchUrl();
						watchUrl = null;
					}
				},
				url: function() {
					if (watchQuery) {
						watchQuery();
						watchQuery = null;
					}					
					if (watchProtocol) {
						watchProtocol();
						watchProtocol = null;
					}
					if (watchHost) {
						watchHost();
						watchHost = null;
					}
					if (!watchUrl)
						watchUrl = $scope.$watch("url", processUrl);
				},
				protocol: function(){
					if(!watchProtocol)
						watchProtocol = $scope.$watch("protocol", processProtocol);
				},
				host: function(){
					if(!watchHost)
						watchHost = $scope.$watch("host", processHost);
				}
			};
			$scope.removeQuery = function($index)
			{
				$scope.query.splice($index,1);
				processList($scope.query);
			}

			function processList(query) {
				console.log(query);
				var uri = URI($scope.url).setQuery({});
				uri.removeQuery(URI.parseQuery(uri.query()));
				for (var i = 0; i < query.length;) {
					var current = query[i];
					if (!current.name && !current.value) {
						query.splice(i, 1);
					} else {
						i++;
						if(current.name)
							uri.addQuery(current.name, current.value);
					}
				}
				$scope.url = uri.toString();
				query.push({});
			}

			function processUrl(url) {
				var uri = URI(url);
				var queryObj = URI.parseQuery(uri.query());
				$scope.query = [];
				for (var key in queryObj) {
					$scope.query.push({
						name: key,
						value: queryObj[key]
					});
				}
				$scope.query.push({});

				$scope.protocol =  URI(url).protocol();
				$scope.host = URI(url).hostname();
			}
			function processProtocol(protocol)
			{
				$scope.url = URI($scope.url).protocol(protocol).toString();
			}
			function processHost(host)
			{
				$scope.url = URI($scope.url).hostname(host).toString();
			}
		})();



		$scope.jquery = $().jquery;
		$scope.headers = [1, 2, 3, 4];
		$scope.url = "http://www.google.com";

		function query() {
			$.ajax({
				url: $scope.url,
				type: $scope.method,
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