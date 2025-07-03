# TypingMind Extensions & Themes Collection

A curated collection of custom JavaScript extensions and themes for TypingMind, designed to enhance functionality and improve the user experience.

## 📁 Project Structure

```
tm/
├── README.md
├── RESOURCES.md         # Comprehensive documentation of extension sources
├── Typing Mind Extensions.md
├── llms.txt             # Large data file (565KB+)
├── extensions/          # JavaScript extensions for TypingMind
│   ├── auto-thought-toggle.js
│   ├── cloud-backup.js
│   ├── hide-teams.js
│   ├── plugin-export-chats.js
│   ├── plugin-js-zip.js
│   ├── quote-reply.js
│   ├── rearrange-plugins.js
│   └── xml-tag-creator.js
└── themes/             # UI themes and visual customizations
    ├── gpt.js
    └── ui-tweaks.js
```

## 🔧 Extensions

### auto-thought-toggle.js
**Automatically manages "Thinking..." details expansion**
- Auto-opens streaming "Thinking..." details during generation
- Collapses when the actual response starts
- Adds a toggle option in the "More actions" menu
- Stores preference in localStorage
- Console helpers: `autoThoughtToggle.enable()`, `disable()`, `status()`

### cloud-backup.js
**Large cloud backup and restore functionality** (63KB file)
- Comprehensive backup system for TypingMind data
- Cloud storage integration capabilities
- Data restoration features
- Note: This is a substantial extension with advanced functionality

### quote-reply.js
**Text selection and block-quote reply system**
- Select text within chat messages to create quotes
- Collect multiple selections as formatted quotes
- Send quotes as block-quote replies with proper markdown formatting
- Visual popover interface for quote creation
- Keyboard shortcuts and mouse interactions

### rearrange-plugins.js
**Trello-style plugin drag-and-drop reordering**
- Drag plugins like Trello cards with visual feedback
- Auto-scroll when dragging near list boundaries
- Persistent order storage in localStorage
- Smooth animations and visual placeholders
- Handle-based dragging interface

### xml-tag-creator.js
**XML tag wrapper with modal interface**
- Wrap text/code in custom XML tags via toolbar button
- Modal interface with recent tags history (10 most recent)
- CDATA wrapping option for code blocks
- Code block integration with language specification
- Tag name sanitization (XML-compliant naming)
- Space-to-underscore conversion for tag names

### hide-teams.js
**Simple Teams tab removal**
- Hides the "Teams" tab from the workspace sidebar
- Clean CSS injection approach
- Minimal code footprint (18 lines)
- Instant visual effect

### plugin-export-chats.js
**Comprehensive chat export system**
- Export all chats as markdown files in a ZIP archive
- Export individual chat as markdown file
- Organized folder structure based on chat folders
- YAML front matter with metadata (chatID, model, tokens, tags)
- Sanitized filenames with date prefixes
- Two sidebar buttons: "Export All" and "Export Chat"
- Requires plugin-js-zip.js for ZIP functionality

### plugin-js-zip.js
**JSZip library dependency**
- Provides ZIP compression functionality for chat exports
- Required by plugin-export-chats.js
- Large library file (~47KB) with full JSZip implementation

## 🎨 Themes

### gpt.js
**ChatGPT-inspired visual theme**
- Clean, familiar ChatGPT-style interface
- Consistent font styling and spacing
- Improved sidebar styling and colors
- Enhanced code block presentation
- Better message formatting and readability
- Dark/light theme support

### ui-tweaks.js
**Comprehensive UI customization system**
- Hide/show various UI elements (Teams, KB, Logo, Profile, etc.)
- Custom color pickers for UI elements
- Custom font loading and sizing
- Custom favicon support
- Page title customization
- Settings modal with keyboard shortcut (Shift+Alt+T)
- Persistent settings via localStorage

## 🚀 Installation

### Method 1: Direct File Installation
1. Copy the desired `.js` file content
2. Go to **TypingMind → Preferences → Advanced Settings → Extensions**
3. Add new extension and paste the code
4. Click "Install" and **restart the app** for changes to take effect

### Method 2: URL Installation (Recommended for hosting)
1. Host the `.js` file on a public server with proper CORS headers
2. Ensure the server returns `application/javascript` or `text/javascript` MIME type
3. Go to **TypingMind → Preferences → Advanced Settings → Extensions**
4. Enter the public URL and click "Install"
5. **Restart the app** for the extension to load

### Method 3: Custom Code (TypingMind Custom)
If you're using [TypingMind Custom](https://custom.typingmind.com/), you can use the "Custom Code" feature which works similarly to extensions.

## ⚠️ Important Notes

### Security Considerations
- **Full Access**: Extensions have complete access to TypingMind data and functionality
- **Review Code**: Always review extension code before installation
- **Trusted Sources**: Only install extensions from sources you trust
- **Data Safety**: Extensions can read and modify all application data
- **No Official Support**: TypingMind does not provide technical support for custom extensions

### How Extensions Work
- Extensions work like browser extensions but can be installed on macOS app and mobile PWA
- Extensions are loaded once when the app starts
- Extensions are installed locally in the user's browser
- Extensions sync across devices by default (included in "Preferences" sync group)

### Data Access
Extensions have access to TypingMind's data through:
- **localStorage**: General app settings and preferences
- **IndexedDB**: Chat messages and other user-generated data
- **UI Elements**: Access via `data-element-id` attributes

### Compatibility & Limitations
- Compatible with TypingMind web, macOS app, and mobile PWA
- UI element IDs may change with TypingMind updates
- No documented data model - schemas may change without notice
- Extensions requiring data modification should be tested carefully

### Troubleshooting
- **Safe Mode**: Add `?safe_mode=1` to URL to disable extensions (e.g., `https://www.typingmind.com/?safe_mode=1`)
- **Developer Tools**: Use browser dev tools to debug extension issues
- **Console Logs**: Check browser console for extension error messages
- **Restart Required**: Extensions only load when the app starts

### Common Issues
| Issue | Cause | Solution |
|-------|--------|----------|
| "Failed to load extension" with ERR_BLOCKED_BY_ORB | Incorrect MIME type | Ensure server returns `application/javascript` or `text/javascript` |
| Extension not working | Extension not loaded | Restart TypingMind after installation |
| UI broken after extension | Extension conflict | Use Safe Mode to disable and remove problematic extensions |

## 📚 Development Resources

### Official Documentation
- [TypingMind Extensions Guide](https://docs.typingmind.com/typing-mind-extensions)
- [Plugin Development](https://docs.typingmind.com/plugins/build-a-typingmind-plugin)
- [Feature List](https://docs.typingmind.com/feature-list)

### Community Resources
- [Awesome TypingMind](https://github.com/TypingMind/awesome-typingmind) - Community extensions
- [TypingMind GitHub](https://github.com/TypingMind) - Official repositories

### Key Development Concepts
- **Data Element IDs**: UI elements use `data-element-id` attributes for targeting
- **MutationObserver**: Used for monitoring DOM changes and re-applying functionality
- **localStorage**: Persistent settings storage across sessions
- **IndexedDB**: Primary storage for chat messages and user data
- **CORS Requirements**: Public URLs must have proper CORS configuration
- **MIME Type**: Server must return `application/javascript` or `text/javascript`

### Extension Use Cases
- **Additional Backup & Sync**: AWS S3, Google Drive, private servers
- **Widget Integration**: Live chat widgets, custom UI components
- **Keyboard Shortcuts**: Custom hotkeys and productivity features
- **Message Rendering**: Custom formatting and display logic
- **Workflow Automation**: Custom business logic and integrations

### Development Best Practices
- **Read Operations**: Generally safe for accessing app data
- **Write Operations**: Test thoroughly across devices and browsers
- **Error Handling**: Implement robust error handling to prevent app crashes
- **Performance**: Use debouncing and efficient DOM manipulation
- **Compatibility**: Account for TypingMind updates and schema changes

## 🤝 Contributing

1. Test extensions thoroughly across different browsers and devices
2. Follow existing code style and patterns
3. Add comprehensive comments for complex functionality
4. Consider backward compatibility with TypingMind updates
5. Document any new features or configuration options

## 📋 Extension Feature Matrix

| Extension | UI Modification | Data Storage | Menu Integration | Keyboard Shortcuts | Auto-Sync |
|-----------|----------------|--------------|-----------------|-------------------|-----------|
| auto-thought-toggle | ✅ | ✅ | ✅ | ❌ | ✅ |
| cloud-backup | ✅ | ✅ | ✅ | ❌ | ✅ |
| quote-reply | ✅ | ❌ | ❌ | ✅ | ❌ |
| rearrange-plugins | ✅ | ✅ | ❌ | ❌ | ✅ |
| xml-tag-creator | ✅ | ✅ | ✅ | ✅ | ✅ |
| hide-teams | ✅ | ❌ | ❌ | ❌ | ❌ |
| plugin-export-chats | ✅ | ✅ | ✅ | ❌ | ✅ |
| plugin-js-zip | ❌ | ❌ | ❌ | ❌ | ❌ |
| gpt | ✅ | ❌ | ❌ | ❌ | ❌ |
| ui-tweaks | ✅ | ✅ | ✅ | ✅ | ✅ |

## 🔍 Example Extension

Here's a simple example that demonstrates the basic structure of a TypingMind extension:

```javascript
// greeting-ext.js - Changes New Chat button text based on time of day
const hours = new Date().getHours();
const greeting = hours < 12 ? 'Good Morning!' : 
                 hours < 18 ? 'Good Afternoon!' : 
                 'Good Evening!';

// Target UI element using data-element-id
document.querySelector('[data-element-id="new-chat-button-in-side-bar"]')
        .childNodes[1].textContent = greeting;
```

This extension:
1. Gets the current hour
2. Determines appropriate greeting
3. Targets the New Chat button using its `data-element-id`
4. Updates the button text

You can host this file publicly and install it via URL, or copy the code directly into TypingMind's extension interface.

---

**⚠️ Disclaimer**: These extensions are provided as-is. TypingMind does not provide technical support for custom extensions. Extensions have full access to application data and can potentially make the app unusable. Always review code carefully, backup your data, and only install extensions from trusted sources. Use at your own risk.