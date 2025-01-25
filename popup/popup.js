document.getElementById('highlight').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id }, // Specify the current tab ID
        files: ['../dist/content.js'], // Inject the content script
      });
    }
  });
});

document.getElementById('unhighlight').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id }, // Specify the current tab ID
        func: () => {
          const article = document.querySelector('article');
          if (article) {
            article.innerHTML = article.innerHTML.replace(/<mark>/g, '').replace(/<\/mark>/g, '');
          }
        }, // Remove the highlights
      });
    }
  });
});
