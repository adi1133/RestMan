var RestMan = angular.module("RestMan");
RestMan.factory("xhr", ["$rootScope",
	function($rootScope) {
		var status = {
			busy: false,
			loaded: 0,
			total: 0,
			code: 0,
			codeDesc: "",
			action: "none",
			response: null,
			headers: null
		};
		var xhr;

		return {
			getStatus: function() {
				return status;
			},
			send: function(options) {
				if (xhr)
					setTimeout(function() {
						xhr.abort()
					}, 0);
				else
					start(options);
			}
		}

		function start(options) {
			xhr = new XMLHttpRequest();
			xhr.open(options.method, options.url);
			xhr.responseType = "blob";
			xhr.onloadstart = function(event) {
				status.busy = true;
				status.action = "started";
			}

			xhr.onprogress = function(event) {
				status.loaded = event.loaded;
				if (event.lengthComputable) {
					status.total = event.total;
				} else {
					status.total = 0;
				}
				if (xhr) {
					status.code = xhr.status;
					status.codeDesc = xhr.statusText;
				}
				$rootScope.$apply();

			}
			xhr.onerror = function() {
				status.action = "error";
			}
			xhr.onabort = function() {
				status.action = "abort";
			}
			xhr.onload = function() {
				status.action = "success";
				status.headers = getHeaders(xhr);
				// if (xhr.response.length < 0.1 * 1024 * 1024)
				// 	$scope.response = xhr.response;
				// else
				// 	$scope.response = "too big";
			}
			xhr.ontimeout = function() {
				status.action = "timeout";
			}
			xhr.onloadend = function(event) {
				status.busy = false;
				status.code = xhr.status;
				status.codeDesc = xhr.statusText;
				status.response = xhr.response;
				$rootScope.$apply();
				xhr = undefined;
			}
			xhr.send();
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