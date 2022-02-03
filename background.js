
self.importScripts('glue.js');

// https://stackoverflow.com/a/2401788
glue.browser.runtime.onInstalled.addListener((details) => {
  const reason = details.reason

  if (reason == 'install') {
    glue.browser.tabs.create({ url: chrome.runtime.getURL("options.html") });
  }
})

