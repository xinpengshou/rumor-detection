// Create and inject CSS for the results panel
const style = document.createElement('style');
style.textContent = `
  .rumor-detector-panel {
    position: absolute;
    width: 300px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    overflow-y: auto;
    padding: 15px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    border: 1px solid #e0e0e0;
    max-height: 300px;
    color: #000000;
  }
  .rumor-detector-panel h3 {
    margin: 0 0 10px 0;
    color: #4285f4;
    font-size: 16px;
    font-weight: 500;
  }
  .rumor-detector-panel .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #666;
    font-size: 18px;
    line-height: 1;
  }
  .rumor-detector-panel .content {
    margin-top: 5px;
    color: #000000;
  }
  .rumor-detector-panel .loading {
    text-align: center;
    color: #666;
    padding: 20px;
  }
  .rumor-detector-panel .error {
    color: #d93025;
    padding: 10px;
  }
  .rumor-detector-panel .section {
    margin-bottom: 12px;
  }
  .rumor-detector-panel .section-title {
    color: #4285f4;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .rumor-detector-panel .section-content {
    margin-left: 8px;
    color: #000000;
  }
  .rumor-detector-panel .sources {
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid #e0e0e0;
    font-size: 12px;
    color: #000000;
  }
  .rumor-detector-panel .analysis-content {
    color: #000000;
  }
`;
document.head.appendChild(style);

// Store last selection
let lastSelection = null;

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // Store selection info if text is selected
    if (selectedText && selection.rangeCount > 0) {
      lastSelection = {
        text: selectedText,
        range: selection.getRangeAt(0).cloneRange()
      };
    }
    
    sendResponse({selectedText: selectedText});
    return false; // Synchronous response
  }
  
  if (request.action === "showResult") {
    if (!request.result) {
      showResultPanel('<div class="loading">Analyzing text...</div>');
    } else {
      showResultPanel(formatContent(request.result));
    }
    return false; // Synchronous response
  }
});

function formatContent(content) {
  // If content is already HTML formatted, return as is
  if (content.includes('<div class="loading">') || 
      content.includes('<div class="error">')) {
    return content;
  }

  // Split content into sections
  const sections = content.split(/(?=Summary:|Key Claims:|Sources:)/g);
  
  let formattedContent = '<div class="analysis-content">';
  
  sections.forEach(section => {
    if (section.trim()) {
      const [title, ...contentParts] = section.split(':');
      const sectionContent = contentParts.join(':').trim();
      
      formattedContent += `
        <div class="section">
          <div class="section-title">${title.trim()}:</div>
          <div class="section-content">${sectionContent.replace(/\n/g, '<br>')}</div>
        </div>
      `;
    }
  });
  
  formattedContent += '</div>';
  return formattedContent;
}

function showResultPanel(content) {
  // Remove existing panel if any
  const existingPanel = document.querySelector('.rumor-detector-panel');
  if (existingPanel) {
    existingPanel.remove();
  }

  // Create panel
  const panel = document.createElement('div');
  panel.className = 'rumor-detector-panel';
  panel.innerHTML = `
    <span class="close-btn" onclick="this.parentElement.remove()">✕</span>
    <h3>Rumor Analysis</h3>
    <div class="content">${content || '<div class="loading">Analyzing text...</div>'}</div>
  `;

  // Position panel
  if (lastSelection && lastSelection.range) {
    const rect = lastSelection.range.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Position below the selection
    panel.style.top = (rect.bottom + scrollTop + 10) + 'px';
    
    // Center horizontally relative to selection
    const leftPosition = rect.left + scrollLeft + (rect.width / 2) - (150); // Center of panel
    const maxLeft = window.innerWidth - 320; // Keep panel in viewport
    panel.style.left = Math.max(20, Math.min(leftPosition, maxLeft)) + 'px';
  } else {
    // Fallback position if no selection
    panel.style.top = '100px';
    panel.style.left = '100px';
  }

  // Add to page
  document.body.appendChild(panel);

  // Close panel when clicking outside
  setTimeout(() => {
    const clickHandler = (e) => {
      if (!panel.contains(e.target)) {
        panel.remove();
        document.removeEventListener('click', clickHandler);
      }
    };
    document.addEventListener('click', clickHandler);
  }, 100);

  // Auto-remove after 30 seconds
  setTimeout(() => {
    if (panel.parentElement) {
      panel.remove();
    }
  }, 30000);
} 