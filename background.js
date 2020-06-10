function getVideoDetails(videoIds, completion) {
    $.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {part: "contentDetails,statistics,snippet", id: videoIds, key: apiKey},
        (response) => {
            completion(response.items.map(x => ({
                videoId: x.id,
                title: x.snippet.title,
                description: x.snippet.description,
                duration: x.contentDetails.duration,
                likeCount: x.statistics.likeCount,
                viewCount: x.statistics.viewCount,
                thumbnail: x.snippet.thumbnails.medium.url
            })));
        }
    );
}

function input() {
    console.log("input!")
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        console.log("queried!")
        chrome.tabs.sendMessage(tabs[0].id, {action: "getVideos"}, function(videoIds) {
            if (videoIds) {
                getVideoDetails(videoIds.join(","), response => {
                    chrome.storage.local.set({cachedResults: response}, 
                        () => chrome.tabs.create({url: "popup.html#window"}));
                })
            }
        });  
    });
}
chrome.omnibox.onInputEntered.addListener(input);
console.log("background script run!");