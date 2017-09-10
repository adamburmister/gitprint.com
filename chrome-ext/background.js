// define rule
const pageActionRules = [{
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'github.com' },
        })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
}, {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'gist.github.com' },
        })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
}]

// register rule
chrome.runtime.onInstalled.addListener(function (details) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules(pageActionRules);
    })
})

// on button click
chrome.pageAction.onClicked.addListener(function (tab) {
    const url = new URL(tab.url)
    console.info('opening GitPrint for', url.toString())

    // get print url
    if (url.hostname == 'gist.github.com') {
        url.pathname += '/raw'
    }
    url.hostname = 'gitprint.com'

    // open new tab on print page
    chrome.tabs.create({ url: url.toString() })
})
