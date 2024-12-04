document.addEventListener('DOMContentLoaded', function() {
  const saveKeyButton = document.getElementById('saveKey');
  const checkTextButton = document.getElementById('checkText');
  const apiKeyInput = document.getElementById('apiKey');
  const resultDiv = document.getElementById('result');

  // Load saved API key
  chrome.storage.local.get(['geminiApiKey'], function(result) {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  // Save API key
  saveKeyButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ geminiApiKey: apiKey }, function() {
        resultDiv.textContent = 'API key saved successfully!';
      });
    } else {
      resultDiv.textContent = 'Please enter a valid API key.';
    }
  });

  // Check selected text
  checkTextButton.addEventListener('click', async function() {
    resultDiv.textContent = 'Getting selected text...';
    
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      if (!tab) {
        resultDiv.textContent = 'Error: Could not find active tab';
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, {action: "getSelectedText"});
      
      if (!response) {
        resultDiv.textContent = 'Error: No response from content script. Please refresh the page and try again.';
        return;
      }

      if (!response.selectedText) {
        resultDiv.textContent = 'Please select some text on the page first.';
        return;
      }

      const apiKey = apiKeyInput.value.trim();
      if (!apiKey) {
        resultDiv.textContent = 'Please enter your Gemini API key first.';
        return;
      }

      resultDiv.textContent = 'Analyzing text...';

      // Send text to background script for analysis
      chrome.runtime.sendMessage({
        action: 'analyzeText',
        text: response.selectedText,
        apiKey: apiKey
      }, function(response) {
        if (chrome.runtime.lastError) {
          resultDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
          return;
        }
        if (response.error) {
          resultDiv.textContent = 'Error: ' + response.error;
        } else {
          resultDiv.innerHTML = response.result;
        }
      });
    } catch (error) {
      resultDiv.textContent = 'Error: ' + error.message;
    }
  });
}); 