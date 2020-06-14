# Custom Youtube

YouTube doesn't have an option to sort by duration. You can only filter by "short videos" and "long videos", so here I made a chrome extension that does exactly that.

# Installation

1. Download the latest release, or the latest commit with the message "updated to version &lt;version number&gt;"
2. Add a file called secret.js
3. Declare a variable called `apiKey` and put your API key for the YouTube Data API in it:

        var apiKey = "...";

4. [Install the chrome extension by following this Stack Overflow answer.](https://stackoverflow.com/a/24577660/5133585)

# How it works

In fact, the YouTube Data API doesn't have a sort by duration option either, so what I did was to request search results *by relevance*, and then sort them on the client. Note that I only fetch the **250** most relevant videos, anything more than that is going to take (IMO) too long to fetch and sort. I can't fetch them lazily (e.g. infinite scrolling) either because the new results I get would affect the sort order. 250 results is enough for most people, in my experience, anyway.

# How to use

## Popup - Sort the search results!

1. Click the popup icon on the top right of chrome. 
2. A new tab with a search box will appear. 
3. Type in the search box and search.
4. Wait a few seconds.
5. The search results will be sorted!

## Omnibox - Sort the videos that are in the active tab!

1. Go to a YouTube page containing some videos
2. Type in `cy` and a space
3. Optionally, include 2 one-based indices, separated by commas, indicating the start and end index of the videos you want to sort. e.g. `10,50` means "sort the 10th to the 50th video".
4. Press enter and wait!

