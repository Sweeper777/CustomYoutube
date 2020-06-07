function parseHref(href) {
    var regex = /^\/watch\?v=(.+)$/;
    var match = regex.exec(href);
    return match[1] ?? undefined;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("message received");
        if (request.action === "getVideos") {
            var allVideoElements = $("ytd-rich-grid-video-renderer, ytd-grid-video-renderer, ytd-video-renderer");
            var aTags = allVideoElements.children("a#thumbnail").get();
            var hrefs = aTags.map(x => $(x).attr("href"));
            var videoIds = hrefs.map(parseHref).filter(x => x).slice(0, 50);
            sendResponse(videoIds)
        }
    });