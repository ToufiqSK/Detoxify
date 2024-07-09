chrome.storage.sync.get(["blockedKeywords", "detoxifyEnabled"], ({ blockedKeywords, detoxifyEnabled }) => {
    if (!detoxifyEnabled) return;
  
    const observer = new MutationObserver(() => {
      document.querySelectorAll("ytd-thumbnail").forEach(thumbnail => {
        const renderer = thumbnail.closest("ytd-rich-item-renderer");
        if (!renderer) return;
  
        const titleElement = renderer.querySelector("#video-title");
        if (!titleElement) return;
  
        const title = titleElement.innerText;
        if (blockedKeywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
          thumbnail.style.filter = "blur(5px)";
          titleElement.style.textDecoration = "line-through";
          titleElement.setAttribute("title", "This video is marked as not preferred by Detoxify extension");
        }
      });
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  });
      