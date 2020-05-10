function parseHref(href) {
    var regex = /^\/watch\?v=(.+)$/;
    var match = regex.exec(href);
    return match[1] ?? undefined;
}

function getVideoDetails(videoIds, completion) {
    $.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {part: "contentDetails,statistics,snippet", id: videoIds, key: apiKey},
        (response) => {
            completion(response.items.map(x => ({
                videoId: x.videoId,
                title: x.snippet.title,
                description: x.snippet.description,
                duration: x.duration,
                likeCount: x.likeCount,
                viewCount: x.viewCount,
                thumbnail: x.snippet.thumbnails.medium.url
            })));
        }
    );
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("message received");
        if (request.action === "getVideos") {
            var allVideoElements = $("ytd-rich-grid-video-renderer, ytd-grid-video-renderer, ytd-video-renderer");
            var aTags = allVideoElements.children("a#thumbnail").get();
            var hrefs = aTags.map(x => $(x).attr("href"));
            var videoIds = hrefs.map(parseHref).filter(x => x).slice(0, 50);
            getVideoDetails(videoIds.join(","), response => {
                chrome.storage.local.set({cachedResults: response}, () => sendResponse("success"));
            })
            return true
        }
    });