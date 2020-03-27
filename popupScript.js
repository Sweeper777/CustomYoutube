var searchResults = [
]

function onLoad() {
    if (window.location.hash != '#window') {
        chrome.tabs.create({url: 'popup.html#window'});
        return;
    }
    $("#searchButton").click(searchClick);
    $('#searchTerm').on('keypress', function (e) {
        if(e.which === 13){
           $("#searchButton").trigger("click");
        }
    });
}

function searchClick() {
    console.log("clicked");
    $.get(
        "https://www.googleapis.com/youtube/v3/search",
        {part: "snippet", q: $("#searchTerm").val
        (), type: "video", key: apiKey, maxResults: 5},
        (response) => {
            let videoIds = getCommaSeparatedVideoIds(response);
            getVideoDurations(videoIds, (durations) => {
                const zip = (arr1, arr2) => arr1.map((k, i) => [k, arr2[i]]);
                let newSearchResults = zip(response.items, durations).map(x => ({
                    videoId: x[0].id.videoId,
                    title: x[0].snippet.title,
                    description: x[0].snippet.description,
                    duration: x[1],
                    thumbnail: x[0].snippet.thumbnails.medium.url
                }));
                searchResults = searchResults.concat(newSearchResults);
                updateSearchResultsDiv();
            });
        }
    );
}

function getCommaSeparatedVideoIds(searchResponse) {
    return searchResponse.items.map(x => x.id.videoId).join(",");
}

function getVideoDurations(videoIds, completion) {
    $.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {part: "contentDetails", id: videoIds, key: apiKey},
        (response) => {
            completion(response.items.map(x => x.contentDetails.duration));
        }
    );
}

function updateUI() {
    refreshPagingControl();
    updateSearchResultsDiv();
}

function updateSearchResultsDiv() {
    let searchResultsDiv = $("#searchResults");
    searchResultsDiv.empty();
    for (var i = 0 ; i < searchResults.length ; i++) {
        var htmlString = "<div class=\"row\"><div class=\"col-md-4\"><a href=\"https://youtube.com/watch?v=";
        htmlString += searchResults[i].videoId;
        htmlString += "\"><img src=\"";
        htmlString += searchResults[i].thumbnail;
        htmlString += "\"></a></div><div class=\"col-md-7\"><a href=\"https://youtube.com/watch?v=";
        htmlString += searchResults[i].videoId;
        htmlString += "\"><h4>";
        htmlString += searchResults[i].title;
        htmlString += "</h4><p>";
        htmlString += searchResults[i].description;
        htmlString += "</p><p><small>Duration: ";
        htmlString += searchResults[i].duration;
        htmlString += "</small></p></a></div></div>";
        console.log(htmlString);
        searchResultsDiv.append(htmlString);
    }
}

window.onload = onLoad;