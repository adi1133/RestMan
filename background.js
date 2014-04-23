chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({url : "main.html"}); 
});

var queryPrefix;

(function(){
	var extId = chrome.runtime.id;
	var extUri = "chrome-extension://" + extId;
	queryPrefix = extUri + "/main.html#/query/";
})();

chrome.webRequest.onBeforeRequest.addListener(
function(details) {
	console.log(details);
	var payload = details.url.split("://x/")[1];
	return {redirectUrl: queryPrefix + payload};
	
},{urls: ["*://x/*"]},["blocking"]);