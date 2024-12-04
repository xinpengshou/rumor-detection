# Rumor Detector Chrome Extension

A Chrome extension that leverages Google's Gemini AI to analyze text for potential rumors, misinformation, or unverified claims in real-time.

## Inspiration

In today's digital age, misinformation spreads rapidly across social media and news platforms. We were inspired to create a tool that helps users quickly verify information while browsing. The rise of AI technology, particularly Google's Gemini, presented an opportunity to build a solution that could analyze content instantly and provide reliable fact-checking resources.

## What it does

Rumor Detector is a Chrome extension that:
- Analyzes selected text for potential rumors and misinformation
- Provides instant analysis with a clean, floating panel interface
- Breaks down the analysis into three key components:
  1. Summary: A quick verdict on the reliability of the content
  2. Key Claims: Bullet points of main claims and their credibility
  3. Sources: Links to relevant fact-checking websites
- Works seamlessly through both right-click context menu and popup interface
- Securely stores your API key locally

## How we built it

The extension was built using:
- Chrome Extension Manifest V3
- JavaScript for core functionality
- Google's Gemini AI API for text analysis
- Custom CSS for a modern, unobtrusive UI
- Asynchronous messaging between content scripts and background services

Key components:
1. Content Script: Handles text selection and result display
2. Background Script: Manages API communication and context menu
3. Popup Interface: Provides API key management
4. Custom UI: Floating panel with responsive positioning

## Challenges we ran into

1. Message Passing: Coordinating communication between different parts of the extension (content scripts, background scripts, and popup)
2. UI Positioning: Creating a floating panel that follows text selection and stays within viewport bounds
3. API Integration: Handling asynchronous responses from Gemini AI while maintaining a smooth user experience
4. Error Handling: Developing robust error handling for various scenarios (no API key, network issues, invalid responses)

## Accomplishments that we're proud of

1. Clean, Intuitive Interface: Created a non-intrusive UI that appears exactly where needed
2. Real-time Analysis: Achieved quick response times for text analysis
3. Robust Error Handling: Implemented comprehensive error management with user-friendly messages
4. Secure Design: Ensured secure storage of API keys and safe data handling
5. Cross-platform Compatibility: Works consistently across different websites

## What we learned

1. Chrome Extension Architecture: Deep understanding of extension components and their interaction
2. AI Integration: Experience with implementing AI APIs in real-world applications
3. UX Design: Importance of user feedback and smooth transitions
4. Security Practices: Proper handling of API keys and sensitive data
5. Error Management: Comprehensive approach to handling edge cases and errors

## What's next for Rumor Detector

Future enhancements planned:
1. Enhanced Analysis:
   - Support for multiple languages
   - Image analysis capabilities
   - More detailed credibility scoring

2. User Features:
   - History of analyzed content
   - Custom fact-checking sources
   - Sharing capabilities

3. Technical Improvements:
   - Offline capability for basic checks
   - Browser sync for settings
   - Performance optimizations

4. Integration:
   - Support for more browsers
   - Mobile version
   - Integration with popular social media platforms

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Setup

1. Get a Gemini API key from Google AI Studio (https://makersuite.google.com/app/apikey)
2. Click the extension icon in Chrome
3. Enter your API key and click "Save API Key"

## Usage

1. Select any text on a webpage
2. Either:
   - Right-click and select "Check for Rumors"
   - Click the extension icon and use "Check Selected Text"
3. View the analysis results in the floating panel

## Note

You'll need a valid Gemini API key to use this extension. The extension securely stores your API key locally in your browser. 