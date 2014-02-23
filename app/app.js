var RestMan = angular.module("RestMan", ["ui.bootstrap", "ui.sortable"]);
RestMan.controller("MainCtrl", ["$scope",
	function($scope) {
		$scope.manifest = chrome.runtime.getManifest();

		$scope.list = ["one", "two", "thre", "four", "five", "six"];

		$scope.method = "HEAD";

		$scope.status = {
			busy: false,
			loaded: 0,
			total: 0,
			code: 0,
			action: "none"
		};

		(function() {
			var xhr;
			$scope.action = function() {
				if (xhr)
					setTimeout(function() {
						xhr.abort()
					}, 0);
				else
					start();
			}

			function start() {
				xhr = new XMLHttpRequest();
				xhr.open($scope.method, $scope.url);

				xhr.onloadstart = function(event){
					$scope.status.busy = true;
					$scope.status.action = "started";
				}

				xhr.onprogress = function(event) {
					$scope.status.loaded = event.loaded;
					if (event.lengthComputable) {
						$scope.status.total = event.total;
					} else {
						$scope.status.total = 0;
					}
					$scope.status.code = xhr.status;
					$scope.$apply();

				}
				xhr.onerror = function() {
					$scope.status.action = "error";
				}
				xhr.onabort = function() {
					$scope.status.action = "abort";
				}
				xhr.onload = function() {
					$scope.status.action = "success";
					$scope.headers = getHeaders(xhr);
					if (xhr.response.length < 0.1 * 1024 * 1024)
						$scope.response = xhr.response;
					else
						$scope.response = "too big";
				}
				xhr.ontimeout = function()
				{
					$scope.status = "timeout";
				}
				xhr.onloadend = function(event) {
					$scope.status.busy = false;
					$scope.status.code = xhr.status;
					$scope.$apply();
					xhr = undefined;
				}
				xhr.send();
			}
		})();


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
				path: function(){
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
					if (!current.name && !current.value) {
						query.splice(i, 1);
					} else {
						i++;
						if (current.name)
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
			function processPath(path){
				$scope.url = URI($scope.url).path(path).toString();
			}
		})();



		$scope.jquery = $().jquery;
		$scope.headers = [1, 2, 3, 4];
		$scope.url = "http://www.google.com";



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