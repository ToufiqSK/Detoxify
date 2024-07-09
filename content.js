function applyFilters() {
  chrome.storage.sync.get(["blockedKeywords", "detoxifyEnabled"], ({ blockedKeywords, detoxifyEnabled }) => {
    const thumbnails = document.querySelectorAll("ytd-thumbnail");
    thumbnails.forEach(thumbnail => {
      const renderer = thumbnail.closest("ytd-rich-item-renderer");
      if (!renderer) return;

      const titleElement = renderer.querySelector("#video-title");
      if (!titleElement) return;

      const title = titleElement.innerText.toLowerCase();
      const shouldBlur = detoxifyEnabled && blockedKeywords.some(keyword => title.includes(keyword.toLowerCase()));

      if (shouldBlur) {
        renderer.style.display = "none"; // Hide the video
       /* thumbnail.style.filter = "blur(5px)";
        titleElement.style.textDecoration = "line-through";*/
        titleElement.setAttribute("title", "This video is marked as not preferred by Detoxify extension");
      } else {
        renderer.style.display = ""; // Show the video if not blocked
        thumbnail.style.filter = "";
        titleElement.style.textDecoration = "";
        titleElement.removeAttribute("title");
      }
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

applyFilters(); // Initial application of filters when the script loads
