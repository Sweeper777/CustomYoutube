function input() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "getVideos"}, function(response) {
            
        });  
    });
}
chrome.omnibox.onInputEntered.addListener(input);