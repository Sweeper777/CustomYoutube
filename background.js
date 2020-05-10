function input() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "getVideos"}, function(response) {
            if (response === "success") {
                chrome.tabs.create({url: "popup.html#window"});
            }
        });  
    });
}
chrome.omnibox.onInputEntered.addListener(input);