// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkRumors",
    title: "Check for Rumors",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "checkRumors") {
    try {
      // Show loading state
      chrome.tabs.sendMessage(tab.id, {
        action: "showResult",
        result: '<div class="loading">Analyzing text...</div>'
      });

      // Get API key
      const result = await chrome.storage.local.get(['geminiApiKey']);
      if (!result.geminiApiKey) {
        chrome.tabs.sendMessage(tab.id, {
          action: "showResult",
          result: '<div class="error">Please set your Gemini API key in the extension popup.</div>'
        });
        chrome.action.openPopup();
        return;
      }

      if (!info.selectionText) {
        chrome.tabs.sendMessage(tab.id, {
          action: "showResult",
          result: '<div class="error">Please select some text to analyze.</div>'
        });
        return;
      }

      // Analyze text
      const response = await analyzeTextWithGemini(info.selectionText, result.geminiApiKey);
      
      // Send result
      chrome.tabs.sendMessage(tab.id, {
        action: "showResult",
        result: response.error ? 
          `<div class="error">Error: ${response.error}</div>` : 
          response.result
      });

    } catch (error) {
      chrome.tabs.sendMessage(tab.id, {
        action: "showResult",
        result: `<div class="error">Error: ${error.message}</div>`
      });
    }
  }
});

async function analyzeTextWithGemini(text, apiKey) {
  if (!text || !apiKey) {
    return { error: 'Missing text or API key' };
  }

  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  const prompt = `Analyze the following text for potential rumors or misinformation. Provide a concise analysis (max 100 words) and include relevant fact-checking website references if available:

${text}

Format your response in this structure (keep it brief):
1. Summary: (One sentence verdict)
2. Key Claims: (Bullet points, max 3)
3. Sources: (List 1-2 relevant fact-checking websites if available)`;

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.8
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid API response format');
    }

    const text = data.candidates[0].content.parts[0].text;
    return { result: text };
  } catch (error) {
    return { error: error.message };
  }
}

// Handle popup requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeText') {
    analyzeTextWithGemini(request.text, request.apiKey)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
}); 