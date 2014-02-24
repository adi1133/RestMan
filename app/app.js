var RestMan = angular.module("RestMan", ["ui.bootstrap", "ui.sortable", "ui.codemirror"]);
RestMan.controller("MainCtrl", ["$scope", "xhr",
	function($scope, xhr) {



		$scope.manifest = chrome.runtime.getManifest();

		$scope.list = ["one", "two", "thre", "four", "five", "six"];

		$scope.method = "HEAD";

		$scope.status = xhr.getStatus();

		$scope.$watch("status.response", function(response) {
			if (response == null) {
				$scope.response = null
			} else {
				// (function() {
				// 	var reader = new FileReader();
				// 	reader.onloadend = function() {
				// 		switch (response.type) {
				// 			case "text/html":
				// 			case "text/xml":
				// 				$scope.response = window.html_beautify(reader.result);
				// 				break;
				// 			case "text/css":
				// 				$scope.response = window.css_beautify(reader.result);
				// 				break;
				// 			case "text/javascript":
				// 			case "application/json":
				// 				$scope.response = window.js_beautify(reader.result);
				// 				break;
				// 			default:
				// 				$scope.response = reader.result;
				// 		}

				// 		$scope.$apply();
				// 	};
				// 	reader.readAsText(response);
				// 	$scope.codemirrorOpts.mode = response.type;
				// })();


				(function() {
					var reader = new FileReader();
					reader.onloadend = function() {
						$("iframe").attr("src", reader.result);
						//$scope.src = reader.result.toString();


						//$scope.$apply();
					};
					reader.readAsDataURL(response);
				})();
			}

		});

		$scope.codemirrorOpts = {
			lineNumbers: true,
			readOnly: true
		};
		$scope.response = "ddaaaa!";

		$scope.query = [{
			name: "a",
			value: "b"
		}];

		$scope.action = function() {
			xhr.send({
				method: $scope.method,
				url: $scope.url
			});
		};

		$scope.protocol = "http";
		$scope.host = "www.google.ro";
		//TODO: add domain / subdomain split
		//TODO: add path and path prefix split
		$scope.path = "/";

		(function() {
			var watchQuery;
			var watchUrl;
			var watchProtocol;
			var watchHost;
			var watchPath;
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
					if (watchPath) {
						watchPath();
						watchPath = null;
					}
					if (!watchUrl)
						watchUrl = $scope.$watch("url", processUrl);
				},
				protocol: function() {
					if (!watchProtocol)
						watchProtocol = $scope.$watch("protocol", processProtocol);
				},
				host: function() {
					if (!watchHost)
						watchHost = $scope.$watch("host", processHost);
				},
				path: function() {
					if (!watchPath)
						watchPath = $scope.$watch("path", processPath);
				}
			};
			$scope.removeQuery = function($index) {
				$scope.query.splice($index, 1);
				processList($scope.query);
			}

			function processList(query) {
				var uri = URI($scope.url).setQuery({});
				uri.removeQuery(URI.parseQuery(uri.query()));
				for (var i = 0; i < query.length;) {
					var current = query[i];
					if (!current.name && !current.value && i != query.length - 1) {
						query.splice(i, 1);
					} else {
						i++;
						if (current.name)
							uri.addQuery(current.name, current.value);
						if (i == query.length) {
							if (current.name || current.value)
								$scope.query.push({});
							$scope.url = uri.toString();
							return;
						}
					}
				}

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

				$scope.protocol = uri.protocol();
				$scope.host = uri.hostname();
				$scope.path = uri.path();
			}

			function processProtocol(protocol) {
				$scope.url = URI($scope.url).protocol(protocol).toString();
			}

			function processHost(host) {
				$scope.url = URI($scope.url).hostname(host).toString();
			}

			function processPath(path) {
				$scope.url = URI($scope.url).path(path).toString();
			}
		})();


		$scope.headers = [];
		$scope.url = "http://www.google.com";



	}
]);