# TypingMind Extensions & Themes - JavaScript File Standards

This document outlines the standardized template and coding conventions for all JavaScript files in the TypingMind extensions and themes collection.

## 📋 File Header Template

All `.js` files in the `extensions/` and `themes/` directories must include the following header:

```javascript
/**
 * [EXTENSION/THEME NAME] for TypingMind
 * 
 * [Brief description of what this extension/theme does]
 * 
 * @author [Author Name]
 * @version [Version Number]
 * @created [YYYY-MM-DD]
 * @updated [YYYY-MM-DD]
 * @category [extension|theme]
 * @requires [Any dependencies, e.g., "plugin-js-zip.js" or "None"]
 * @compatibility TypingMind Web, macOS, Mobile PWA
 * 
 * Features:
 * - [Feature 1]
 * - [Feature 2]
 * - [Feature 3]
 * 
 * Installation:
 * 1. Go to TypingMind → Preferences → Advanced Settings → Extensions
 * 2. Add extension URL or paste code directly
 * 3. Restart TypingMind for changes to take effect
 * 
 * Usage:
 * [Brief usage instructions]
 * 
 * Configuration:
 * [Any configuration options or settings]
 * 
 * Storage:
 * [What data is stored in localStorage/IndexedDB, if any]
 * 
 * @license MIT
 * @repository https://github.com/[username]/[repository]
 * @source [Original source URL if adapted from elsewhere]
 * 
 * Security Note: This extension has access to all TypingMind data and functionality.
 * Review code carefully before installation.
 */
```

## 🔧 Code Structure Standards

### 1. Wrapper Pattern
All extensions should use an IIFE (Immediately Invoked Function Expression) to avoid global namespace pollution:

```javascript
(() => {
    'use strict';
    
    // Extension code here
    
})();
```

### 2. Error Handling
All extensions should include robust error handling:

```javascript
try {
    // Main functionality
} catch (error) {
    console.error('[ExtensionName] Error:', error);
    // Graceful fallback or user notification
}
```

### 3. Constants and Configuration
Define constants at the top for easy maintenance:

```javascript
const CONFIG = {
    STORAGE_KEY: 'extensionName_settings',
    SELECTORS: {
        targetElement: '[data-element-id="target"]',
        // ... other selectors
    },
    // ... other config options
};
```

### 4. Utility Functions
Use a consistent pattern for utility functions:

```javascript
const Utils = {
    debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    },
    
    safe(fn, context = 'unknown') {
        try {
            return fn();
        } catch (e) {
            console.error(`[ExtensionName] Error in ${context}:`, e);
            return null;
        }
    }
};
```

### 5. DOM Manipulation Best Practices
- Use `data-element-id` attributes for targeting TypingMind elements
- Implement MutationObserver for dynamic UI changes
- Clean up event listeners and observers when appropriate

```javascript
const observer = new MutationObserver((mutations) => {
    // Handle DOM changes
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    observer.disconnect();
});
```

### 6. Storage Conventions
Use consistent naming for localStorage keys:

```javascript
const STORAGE_KEYS = {
    settings: 'extensionName_settings',
    cache: 'extensionName_cache',
    metadata: 'extensionName_metadata'
};
```

### 7. Console Logging
Use consistent logging patterns:

```javascript
const log = {
    info: (msg) => console.log(`[ExtensionName] ${msg}`),
    warn: (msg) => console.warn(`[ExtensionName] ${msg}`),
    error: (msg, error) => console.error(`[ExtensionName] ${msg}`, error)
};
```

## 🎨 Theme-Specific Standards

### CSS Injection Pattern
Themes should use this standardized approach for CSS injection:

```javascript
function injectStyles() {
    if (document.getElementById('themeName-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'themeName-styles';
    style.textContent = `
        /* Theme styles here */
    `;
    document.head.appendChild(style);
}
```

### Theme Configuration
Themes should define color schemes and styling options:

```javascript
const THEME_CONFIG = {
    colors: {
        primary: '#000000',
        secondary: '#ffffff',
        // ... other colors
    },
    fonts: {
        primary: 'Arial, sans-serif',
        // ... other fonts
    },
    // ... other theme options
};
```

## 📊 Extension Categories

### UI Enhancement Extensions
- File naming: `[feature-name].js`
- Focus on improving user interface elements
- Examples: `quote-reply.js`, `xml-tag-creator.js`

### Functional Extensions
- File naming: `[function-name].js`
- Add new functionality to TypingMind
- Examples: `plugin-export-chats.js`, `cloud-backup.js`

### Utility Extensions
- File naming: `[utility-name].js`
- Provide supporting functionality
- Examples: `plugin-js-zip.js`, `hide-teams.js`

### Theme Extensions
- File naming: `[theme-name].js` or `[theme-name]-theme.js`
- Modify visual appearance
- Examples: `gpt-style-theme.js`, `ui-tweaks.js`

## 🔒 Security Guidelines

1. **Input Validation**: Always validate user inputs
2. **Safe DOM Manipulation**: Use safe methods for DOM updates
3. **Minimal Permissions**: Request only necessary permissions
4. **Error Boundaries**: Prevent extension errors from breaking TypingMind
5. **Data Privacy**: Handle user data responsibly

## 📝 Documentation Requirements

Each extension should include:

1. **Inline Comments**: Explain complex logic
2. **Function Documentation**: Document all public functions
3. **Configuration Options**: Document all user-configurable options
4. **Known Issues**: List any known limitations or issues
5. **Changelog**: Track version changes

## 🧪 Testing Guidelines

1. **Browser Compatibility**: Test in Chrome, Firefox, Safari
2. **Device Testing**: Test on desktop, mobile, and tablet
3. **TypingMind Versions**: Test with different TypingMind configurations
4. **Error Scenarios**: Test error handling and edge cases
5. **Performance**: Monitor for memory leaks and performance issues

## 📦 File Organization

```
extensions/
├── [category]/           # Optional category subdirectories
│   ├── extension.js     # Main extension file
│   ├── README.md        # Extension-specific documentation
│   └── assets/          # Any required assets
└── shared/              # Shared utilities and dependencies
    ├── utils.js
    └── libraries/
        └── plugin-js-zip.js

themes/
├── [theme-name]/
│   ├── theme.js
│   ├── README.md
│   └── assets/
└── shared/
    └── theme-utils.js
```

## 🔄 Version Control

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Update version number in header when making changes
- Update the `@updated` date field
- Maintain changelog in comments or separate file

## 📞 Support and Community

- Extensions should include contact information for support
- Link to repository or source for community contributions
- Include license information
- Provide clear installation and usage instructions

---

**Note**: This template ensures consistency, maintainability, and security across all extensions and themes in the TypingMind collection. All contributors should follow these standards when creating or modifying JavaScript files.