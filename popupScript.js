function onLoad() {
    if (window.location.hash != '#window') {
        chrome.tabs.create({url: 'popup.html#window'});
        return;
    }

window.onload = onLoad;