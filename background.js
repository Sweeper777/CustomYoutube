// Credit to https://www.npmjs.com/package/text-ellipsis
function textEllipsis(str, maxLength, { side = "end", ellipsis = "..." } = {}) {
    if (str.length > maxLength) {
        switch (side) {
            case "start":
            return ellipsis + str.slice(-(maxLength - ellipsis.length));
            case "end":
            default:
            return str.slice(0, maxLength - ellipsis.length) + ellipsis;
        }
    }
    return str;
}

function chunkArray(myArray, chunkSize){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunkSize) {
        myChunk = myArray.slice(index, index+chunkSize);
        tempArray.push(myChunk);
    }

    return tempArray;
}

function getVideoDetails(videoIds, completion) {
    var chunksOf50 = chunkArray(videoIds, 50);
    getVideoDetailsImpl(chunksOf50, completion)
}

function getVideoDetailsImpl(videoIdChunks, completion) {
    var [first, ...rest] = videoIdChunks;
    if (first) {
        $.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {part: "contentDetails,statistics,snippet", id: first, key: apiKey},
            (response) => {
                var videos = response.items.map(x => ({
                    videoId: x.id,
                    title: x.snippet.title,
                    description: textEllipsis(x.snippet.description, 400),
                    duration: x.contentDetails.duration,
                    likeCount: x.statistics.likeCount,
                    viewCount: x.statistics.viewCount,
                    thumbnail: x.snippet.thumbnails.medium.url
                }));
                getVideoDetailsImpl(rest, response => completion(videos.concat(response)));
            }
        );
    } else {
        completion([]);
    }
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