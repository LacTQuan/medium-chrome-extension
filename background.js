chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "unlock-medium-post",
    title: "Unlock this Medium post",
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "read-with-readmedium",
    title: "Read with readmedium",
    contexts: ["all"],
    parentId: "unlock-medium-post",
  });

  chrome.contextMenus.create({
    id: "read-with-freedium",
    title: "Read with freedium",
    contexts: ["all"],
    parentId: "unlock-medium-post",
  });

  // google cached pages
  chrome.contextMenus.create({
    id: "google-cache",
    title: "Google Cached Page",
    contexts: ["all"],
    parentId: "unlock-medium-post",
  });

  chrome.contextMenus.update("unlock-medium-post", { enabled: false });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // if (changeInfo.status === "complete" && tab.url) {
  //   const isMediumPost = tab.url.includes("medium.com");

  //   chrome.contextMenus.update("unlock-medium-post", { enabled: isMediumPost });
  // }
    chrome.contextMenus.update("unlock-medium-post", { enabled: true });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.url) return;

  const mediumUrl = tab.url;

  if (info.menuItemId === "read-with-readmedium") {
    const readMediumUrl =
      "https://readmedium.com/" + encodeURIComponent(mediumUrl);
    chrome.tabs.create({ url: readMediumUrl });
  }

  if (info.menuItemId === "read-with-freedium") {
    const freediumUrl = "https://freedium.cfd/" + encodeURIComponent(mediumUrl);
    chrome.tabs.create({ url: freediumUrl });
  }

  if (info.menuItemId === "google-cache") {
    const googleCacheUrl =
      "https://webcache.googleusercontent.com/search?q=cache:" +
      encodeURIComponent(mediumUrl);
    chrome.tabs.create({ url: googleCacheUrl });
  }
});
