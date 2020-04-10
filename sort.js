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

function sortSearchResultsDurationAscending() {
    searchResults.sort((a, b) => {
        return durationToSeconds(window.parseISO8601Duration(a.duration)) - durationToSeconds(window.parseISO8601Duration(b.duration));
    });
}

function sortSearchResultsDurationDescending() {
    searchResults.sort((a, b) => {
        return -(durationToSeconds(window.parseISO8601Duration(a.duration)) - durationToSeconds(window.parseISO8601Duration(b.duration)));
    });
}

function sortSearchResultsLikesDescending() {
    searchResults.sort((a, b) => {
        return -(a.likeCount - b.likeCount);
    });
}

function sortSearchResultsViewsDescending() {
    searchResults.sort((a, b) => {
        return -(a.viewCount - b.viewCount);
    });
}

function sortSearchResults() {
    [
        sortSearchResultsDurationAscending, 
        sortSearchResultsDurationDescending, 
        sortSearchResultsLikesDescending,
        sortSearchResultsViewsDescending
    ][sortBy]();
}