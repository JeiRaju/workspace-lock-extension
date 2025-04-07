chrome.runtime.onInstalled.addListener(() => {
    console.log("Workspace Lock extension installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveWorkspace") {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const urls = tabs.map(tab => tab.url);
      chrome.storage.local.set({ savedWorkspace: urls });
    });
  }
  if (message.action === "lockWorkspace") {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs.remove(tab.id);
      }
    });
  }
  sendResponse({ status: "done" });
});