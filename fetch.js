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
            getVideoDetails(videoIds, (details) => {
                const zip = (arr1, arr2) => arr1.map((k, i) => [k, arr2[i]]);
                let newSearchResults = zip(response.items, details).map(x => ({
                    videoId: x[0].id.videoId,
                    title: x[0].snippet.title,
                    description: x[0].snippet.description,
                    duration: x[1].duration,
                    likeCount: x[1].likeCount,
                    viewCount: x[1].viewCount,
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

function getVideoDetails(videoIds, completion) {
    $.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {part: "contentDetails,statistics", id: videoIds, key: apiKey},
        (response) => {
            completion(response.items.map(x => ({
                duration: x.contentDetails.duration,
                likeCount: x.statistics.likeCount,
                viewCount: x.statistics.viewCount
            })));
        }
    );
}