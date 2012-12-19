/* content_script.js
 * ~~~~~~~~~~~~~~~~~
 * Grab the title of the torrent and return it.
 *
 */

var message = { 'errors': [] };

// TITLE
message['title'] = $('div.download h2 span').text();

// INFO HASH
var info_hash_text = $('div.trackers div').text();
if (info_hash_text) {
    message['info_hash'] = info_hash_text.split(/ /)[1];
} else {
    message['errors'].push("Unable to extract info hash!");
}

// TRACKERS
// ???

chrome.extension.connect().postMessage(message);
