// Helpers
// -------
// Grabbed from: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

// Display Page Action
// -------------------
function check_for_valid_url(tab_id, change_info, tab)
{
    var url_matches = tab.url.match(/^http:\/\/(www\.)?torrentz\.eu\/[a-fA-F0-9]{40}$/);
    var is_loading  = change_info.status === "loading";

    if (url_matches && is_loading) {
        chrome.pageAction.show(tab_id);
    }
}
chrome.tabs.onUpdated.addListener(check_for_valid_url);

// Handle Page Action
// ------------------
chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(tab.id, { "file": "jquery.min.js" }, function() {
        chrome.tabs.executeScript(tab.id, { "file": "content_script.js" });
    });
});

function open_magnet_uri(tab_id, info)
{
    console.log("Call: open_magnet_uri(%o, %o)", tab_id, info);

    magnet_uri = "magnet:?xt=urn:btih:{0}&dn={1}".format(encodeURIComponent(info.info_hash), encodeURIComponent(info.title));

    console.log("Opening to: %o", magnet_uri);
    $("#magnet_opener").attr('src', magnet_uri);
}

// Connection Listener
// -------------------
chrome.extension.onConnect.addListener(function(port) {
    var tab = port.sender.tab;
    port.onMessage.addListener(function(info) {
        console.log("Received message from content script (via tab %s): %o", tab.id, info);
        open_magnet_uri(tab.id, info);
    });
});
