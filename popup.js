document.getElementById("addKeyword").addEventListener("click", () => {
    const keyword = document.getElementById("keyword").value;
    if (keyword) {
      chrome.storage.sync.get("blockedKeywords", ({ blockedKeywords }) => {
        blockedKeywords.push(keyword);
        chrome.storage.sync.set({ blockedKeywords });
        updateKeywordsList();
      });
    }
  });
  
  document.getElementById("enableDetoxify").addEventListener("change", (event) => {
    chrome.storage.sync.set({ detoxifyEnabled: event.target.checked });
  });
  
  function updateKeywordsList() {
    chrome.storage.sync.get("blockedKeywords", ({ blockedKeywords }) => {
      const keywordsList = document.getElementById("keywordsList");
      keywordsList.innerHTML = "";
      blockedKeywords.forEach(keyword => {
        const li = document.createElement("li");
        li.innerText = keyword;
        keywordsList.appendChild(li);
      });
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    updateKeywordsList();
    chrome.storage.sync.get("detoxifyEnabled", ({ detoxifyEnabled }) => {
      document.getElementById("enableDetoxify").checked = detoxifyEnabled;
    });
  });
  