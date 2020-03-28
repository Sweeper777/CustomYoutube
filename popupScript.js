var searchResults = [
]
var searchResultsPerPage = 50;

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
    chrome.storage.local.get(
        {
            "cachedResults": []
        },
        x => {
            searchResults = x.cachedResults;
            sortSearchResults();
            updateUI();
        }
    );
}

function searchClick() {
    searchResults = []
    fetchSearchResults(5, () => {
        chrome.storage.local.set(
            {
                cachedResults: searchResults
            }
        );
        sortSearchResults();
        updateUI();
    });
}

function fetchSearchResults(depth, completion, pageToken) {
    if (depth === 0) {
        completion();
        return;
    }

    var params;
    if (pageToken === undefined) {
        params = {part: "snippet", q: $("#searchTerm").val(), type: "video", key: apiKey, maxResults: searchResultsPerPage};
    } else {
        params = {part: "snippet", q: $("#searchTerm").val(), type: "video", key: apiKey, maxResults: searchResultsPerPage, pageToken: pageToken};
    }

    $.get(
        "https://www.googleapis.com/youtube/v3/search", params,
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
                if (response.nextPageToken === undefined) {
                    completion();
                } else {
                    fetchSearchResults(depth - 1, completion, response.nextPageToken);
                }
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
    let start = (currentPage - 1) * searchResultsPerPage;
    let end = start + Math.min(searchResults.length - start, searchResultsPerPage);
    for (var i = start; i < end; i++) {
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
        searchResultsDiv.append(htmlString);
    }
}

var currentPage = 1;

function refreshPagingControl() {
    currentPage = 1;
    let pagingUl = $(".pagination");
    pagingUl.empty();
    let pageCount = Math.floor(searchResults.length / searchResultsPerPage);
    pagingUl.append("<li class=\"page-item disabled\"><a class=\"page-link previous-page\" href=\"#window\">Previous</a></li>");
    $(".previous-page").click(() => {
        if (currentPage > 1) {
            currentPage -= 1;
        }
        updatePagingUI();
    });
    pagingUl.append("<li class=\"page-item active\"><a class=\"page-link page1\" href=\"#window\">1</a></li>");
    addGoToPageListener(1);
    for (var i = 2 ; i <= pageCount ; i++) {
        let s = "<li class=\"page-item\"><a class=\"page-link page" + i + "\" href=\"#window\">" + i + "</a></li>";
        pagingUl.append(s);
        addGoToPageListener(i);
    }
    if (pageCount === 1) {
        pagingUl.append("<li class=\"page-item disabled\"><a class=\"page-link next-page\" href=\"#window\">Next</a></li>");
    } else {
        pagingUl.append("<li class=\"page-item\"><a class=\"page-link next-page\" href=\"#window\">Next</a></li>");
    }
    $(".next-page").click(() => {
        if (currentPage < Math.floor(searchResults.length / searchResultsPerPage)) {
            currentPage += 1;
            updatePagingUI();
        }
    });
}

function updatePagingUI() {
    $(".active").removeClass("active");
    $(".page" + currentPage).parent().addClass("active");
    if (currentPage === 1) {
        $(".previous-page").parent().addClass("disabled");
    } else {
        $(".previous-page").parent().removeClass("disabled");
    }
    if (currentPage === Math.floor(searchResults.length / searchResultsPerPage)) {
        $(".next-page").parent().addClass("disabled");
    } else {
        $(".next-page").parent().removeClass("disabled");
    }
    updateSearchResultsDiv();
}

function addGoToPageListener(pageNum) {
    $(".page" + pageNum).click(() => {
        currentPage = pageNum;
        updatePagingUI();
    });
}

var iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

window.parseISO8601Duration = function (iso8601Duration) {
    var matches = iso8601Duration.match(iso8601DurationRegex);

    return {
        sign: matches[1] === undefined ? '+' : '-',
        years: matches[2] === undefined ? 0 : Number(matches[2]),
        months: matches[3] === undefined ? 0 : Number(matches[3]),
        weeks: matches[4] === undefined ? 0 : Number(matches[4]),
        days: matches[5] === undefined ? 0 : Number(matches[5]),
        hours: matches[6] === undefined ? 0 : Number(matches[6]),
        minutes: matches[7] === undefined ? 0 : Number(matches[7]),
        seconds: matches[8] === undefined ? 0 : Number(matches[8])
    };
};

function durationToSeconds(duration) {
    return duration.weeks * 7 * 24 * 60 * 60 + duration.days * 24 * 60 * 60 + duration.hours * 60 * 60 + duration.minutes * 60 + duration.seconds;
}

function durationToString(duration) {
    let totalSeconds = durationToSeconds(duration);
    let minutes = Math.floor(totalSeconds / 60) % 60;
    let hours = Math.floor(totalSeconds / 3600);
    let seconds = totalSeconds % 60;
    var retVal;
    if (hours > 0) {
        retVal = hours.toString().padStart(2, '0') + ":";
    } else {
        retVal = "";
    }
    retVal += minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    return retVal;
}

function sortSearchResults() {
    searchResults.sort((a, b) => {
        return durationToSeconds(window.parseISO8601Duration(a.duration)) - durationToSeconds(window.parseISO8601Duration(b.duration));
    });
}

window.onload = onLoad;
