function parseHref(href) {
    var regex = /^\/watch\?v=([^&]+)$/;
    var match = regex.exec(href);
    return match[1] ?? undefined;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "getVideos") {
            var allVideoElements = $("ytd-rich-grid-video-renderer, ytd-grid-video-renderer, ytd-video-renderer");
            var aTags = allVideoElements.find("a#thumbnail").get();
            var hrefs = aTags.map(x => $(x).attr("href"));
            var videoIds = hrefs.map(parseHref).filter(x => x).slice(request.startIndex, request.endIndex);
            sendResponse(videoIds);
        }
    });