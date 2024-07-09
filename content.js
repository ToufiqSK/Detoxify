function applyFilters() {
  chrome.storage.sync.get(["blockedKeywords", "detoxifyEnabled"], ({ blockedKeywords, detoxifyEnabled }) => {
    if (!detoxifyEnabled) return;

    const thumbnails = document.querySelectorAll("ytd-thumbnail");
    thumbnails.forEach(thumbnail => {
      const renderer = thumbnail.closest("ytd-rich-item-renderer");
      if (!renderer) return;

      const titleElement = renderer.querySelector("#video-title");
      if (!titleElement) return;

      const title = titleElement.innerText.toLowerCase();
      const shouldBlur = blockedKeywords.some(keyword => title.includes(keyword.toLowerCase()));

      thumbnail.style.filter = shouldBlur ? "blur(5px)" : "";
      titleElement.style.textDecoration = shouldBlur ? "line-through" : "";
      titleElement.setAttribute("title", shouldBlur ? "This video is marked as not preferred by Detoxify extension" : "");
    });
  });
}

const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      applyFilters();
    }
  }
});

observer.observe(document.querySelector('ytd-rich-grid-renderer'), { childList: true, subtree: true });

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedKeywords || changes.detoxifyEnabled) {
    applyFilters();
  }
});
