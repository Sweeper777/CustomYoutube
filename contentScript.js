function parseHref(href) {
    var regex = /^\/watch\?v=(.+)$/;
    var match = regex.exec(href);
    return match[1] ?? undefined;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        }
    });