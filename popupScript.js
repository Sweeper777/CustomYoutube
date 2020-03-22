var searchResults = [
]

function onLoad() {
    if (window.location.hash != '#window') {
        chrome.tabs.create({url: 'popup.html#window'});
        return;
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