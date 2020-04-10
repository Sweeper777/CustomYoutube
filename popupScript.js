var searchResults = [
]
var searchResultsPerPage = 50;
var sortBy = 0;
var isSearching = false

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
    $("input[type=radio][name=sortBy]").change(function() {
        sortBy = this.value;
        sortSearchResults();
        updateUI();
    })
    chrome.storage.local.get(
        {
            "cachedResults": []
        },
        x => {
            searchResults = x.cachedResults;
            sortSearchResultsDurationAscending();
            updateUI();
        }
    );
}

function searchClick() {
    if (isSearching) {
        return;
    }

    $("#searchButtonSpan").text("Searching...");
    $("#searchButton").attr("disabled", true);
    isSearching = true;
    searchResults = []
    fetchSearchResults(5, () => {
        chrome.storage.local.set(
            {
                cachedResults: searchResults
            }
        );
        sortSearchResults();
        updateUI();
        $("#searchButtonSpan").text("Search!");
        $("#searchButton").attr("disabled", false);
        isSearching = false;
    });
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
        var htmlString = "<div class=\"row\"><div class=\"col-md-4\"><a target=\"_blank\" href=\"https://youtube.com/watch?v=";
        htmlString += searchResults[i].videoId;
        htmlString += "\"><img src=\"";
        htmlString += searchResults[i].thumbnail;
        htmlString += "\"></a></div><div class=\"col-md-7\"><a target=\"_blank\" href=\"https://youtube.com/watch?v=";
        htmlString += searchResults[i].videoId;
        htmlString += "\"><h4>";
        htmlString += searchResults[i].title;
        htmlString += "</h4><p>";
        htmlString += searchResults[i].description;
        htmlString += "</p><p><small>Duration: ";
        htmlString += durationToString(window.parseISO8601Duration(searchResults[i].duration));
        htmlString += "</small></p><p><small>Likes: ";
        htmlString += searchResults[i].likeCount;
        htmlString += "</small></p></a></div></div>";
        searchResultsDiv.append(htmlString);
    }
}

window.onload = onLoad;
