# TypingMind Extension Development Tools

This directory contains development tools for creating standardized TypingMind extensions and themes.

## 🛠️ Available Tools

### header-generator.js
**Standardized JSDoc Header Generator**

Generates compliant headers according to the CLAUDE.md specification.

#### Usage

**Interactive Mode:**
```bash
node tools/header-generator.js
```

**CLI Mode:**
```bash
node tools/header-generator.js --name "My Extension" --description "Does something cool" --category extension --author "Your Name"
```

#### Features
- Interactive prompts for all header fields
- CLI mode for automation/scripting
- Code template generation with IIFE wrapper
- Automatic CONFIG and Utils boilerplate
- File output with proper structure
- Validation of category types

#### Generated Structure
- Complete JSDoc header with metadata
- IIFE wrapper for namespace isolation
- CONFIG object for centralized configuration
- Utils object with logging and safe execution
- Proper initialization patterns

## 🚀 Quick Start

1. **Create new extension:**
   ```bash
   cd /path/to/tm
   node tools/header-generator.js
   ```

2. **Follow the prompts** to generate your header and boilerplate

3. **Add your functionality** inside the generated template

4. **Test thoroughly** before deployment

## 📋 Example Output

```javascript
/**
 * Example Extension for TypingMind
 * 
 * This extension demonstrates the standardized format
 * 
 * @author Your Name
 * @version 1.0.0
 * @created 2025-01-03
 * @updated 2025-01-03
 * @category extension
 * @requires None
 * @compatibility TypingMind Web, macOS, Mobile PWA
 * 
 * Features:
 * - Example functionality
 * 
 * Installation:
 * 1. Go to TypingMind → Preferences → Advanced Settings → Extensions
 * 2. Add extension URL or paste code directly
 * 3. Restart TypingMind for changes to take effect
 * 
 * Usage:
 * See documentation below
 * 
 * Configuration:
 * No configuration required
 * 
 * Storage:
 * No data stored
 * 
 * @license MIT
 * @repository https://github.com/patrick/tm
 * @source Original implementation
 * 
 * Security Note: This extension has access to all TypingMind data and functionality.
 * Review code carefully before installation.
 */

(() => {
    'use strict';

    // Configuration constants
    const CONFIG = {
        STORAGE_KEY: 'exampleextension_settings',
        SELECTORS: {
            // Add your selectors here
        }
    };

    // Utility functions
    const Utils = {
        log: (message) => console.log(`[ExampleExtension] ${message}`),
        
        safe: (fn, context = 'unknown') => {
            try {
                return fn();
            } catch (e) {
                console.error(`[ExampleExtension] Error in ${context}:`, e);
                return null;
            }
        }
    };

    // Main extension functionality
    function initExtension() {
        Utils.safe(() => {
            // Add your extension logic here
            Utils.log('Extension initialized');
        }, 'initExtension');
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initExtension);
    } else {
        initExtension();
    }
})();
```

## 🎯 Best Practices

1. **Always use the generator** for new extensions to ensure consistency
2. **Fill in all metadata fields** for proper documentation
3. **Test the generated boilerplate** before adding complex functionality
4. **Follow the CLAUDE.md standards** for all development
5. **Use semantic versioning** for version numbers

## 🔧 Requirements

- Node.js 14 or higher
- Basic understanding of JavaScript and TypingMind architecture

## 🐛 Troubleshooting

- **Permission errors**: Ensure you have write access to the target directory
- **Node.js not found**: Install Node.js from nodejs.org
- **Invalid characters in names**: Use only alphanumeric characters and spaces

---

This tool helps maintain consistency across all TypingMind extensions and ensures compliance with the established coding standards.