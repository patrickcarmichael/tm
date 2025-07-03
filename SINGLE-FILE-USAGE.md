# Single File Loading for TypingMind Extensions

This document explains three different approaches to load all extensions and themes with a single URL in TypingMind.

## 🎯 Approaches Available

### 1. **Dynamic Loader** (`all-extensions.js`) - **RECOMMENDED**
**Best for: Production use, flexibility, automatic updates**

```
https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js
```

**Features:**
- ✅ Loads all extensions from individual files
- ✅ Always gets latest version from GitHub
- ✅ Proper dependency management
- ✅ Selective loading with URL parameters
- ✅ Error handling and loading status
- ✅ Maintains all functionality

**Usage Examples:**
```bash
# Load everything
https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js

# Load only specific extensions
https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js?only=quote-reply,gpt,ui-tweaks

# Exclude heavy extensions
https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js?exclude=cloud-backup

# Enable verbose logging
https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js?dev=true&verbose=true
```

### 2. **Embedded Bundle** (`embedded-extensions.js`)
**Best for: Offline use, no external requests, simplified versions**

```
https://raw.githubusercontent.com/patrickcarmichael/tm/main/embedded-extensions.js
```

**Features:**
- ✅ Everything in single file (no additional requests)
- ✅ Works offline once loaded
- ✅ Selective loading with URL parameters
- ⚠️ Contains simplified versions of complex extensions
- ⚠️ Larger initial file size
- ⚠️ Updates require new bundle

**Usage Examples:**
```bash
# Load default extensions
https://raw.githubusercontent.com/patrickcarmichael/tm/main/embedded-extensions.js

# Enable specific extensions only
https://raw.githubusercontent.com/patrickcarmichael/tm/main/embedded-extensions.js?enable=quote-reply,gpt

# Disable specific extensions
https://raw.githubusercontent.com/patrickcarmichael/tm/main/embedded-extensions.js?disable=cloud-backup
```

### 3. **Manual Copy-Paste**
**Best for: Maximum control, customization, security review**

Copy the content of `embedded-extensions.js` and paste directly into TypingMind's extension interface.

**Features:**
- ✅ No external dependencies
- ✅ Can customize before installation
- ✅ Full security review possible
- ⚠️ Manual updates required
- ⚠️ Larger paste operation

## 📊 Comparison Matrix

| Feature | Dynamic Loader | Embedded Bundle | Manual Paste |
|---------|---------------|-----------------|--------------|
| **Ease of Installation** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Automatic Updates** | ✅ | ❌ | ❌ |
| **Full Functionality** | ✅ | ⚠️ | ⚠️ |
| **Offline Support** | ❌ | ✅ | ✅ |
| **Customization** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **File Size** | Small | Large | Large |
| **Network Requests** | Multiple | Single | None |
| **Dependency Management** | ✅ | ⚠️ | ⚠️ |
| **Error Isolation** | ✅ | ✅ | ✅ |

## 🚀 Installation Instructions

### Method 1: Dynamic Loader (Recommended)

1. Copy this URL:
   ```
   https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js
   ```

2. Go to **TypingMind → Preferences → Advanced Settings → Extensions**

3. Click **"Add Extension"**

4. Paste the URL and click **"Install"**

5. **Restart TypingMind** for changes to take effect

### Method 2: Embedded Bundle

1. Copy this URL:
   ```
   https://raw.githubusercontent.com/patrickcarmichael/tm/main/embedded-extensions.js
   ```

2. Follow same installation steps as Method 1

### Method 3: Manual Copy-Paste

1. Open: https://raw.githubusercontent.com/patrickcarmichael/tm/main/embedded-extensions.js

2. Copy the entire file content

3. Go to **TypingMind → Preferences → Advanced Settings → Extensions**

4. Click **"Add Extension"**

5. Paste the code directly and click **"Install"**

6. **Restart TypingMind**

## ⚙️ Configuration Options

### URL Parameters (Methods 1 & 2)

Add these parameters to the URL to customize loading:

#### For Dynamic Loader (`all-extensions.js`):
- `?only=ext1,ext2` - Load only specified extensions
- `?exclude=ext1,ext2` - Load all except specified extensions  
- `?dev=true` - Enable development mode with debug info
- `?verbose=true` - Enable detailed loading logs

#### For Embedded Bundle (`embedded-extensions.js`):
- `?enable=ext1,ext2` - Enable only specified extensions
- `?disable=ext1,ext2` - Disable specified extensions
- `?dev=true` - Enable development mode

#### Available Extension Names:
- `auto-thought-toggle`
- `hide-teams`
- `quote-reply`
- `rearrange-plugins`
- `xml-tag-creator`
- `plugin-js-zip`
- `plugin-export-chats`
- `cloud-backup`
- `gpt`
- `ui-tweaks`

### Examples:
```bash
# Load only quote system and themes
?only=quote-reply,gpt,ui-tweaks

# Load everything except the large cloud backup
?exclude=cloud-backup

# Enable development mode
?dev=true

# Load minimal set for performance
?only=hide-teams,auto-thought-toggle,gpt
```

## 🔍 Troubleshooting

### Common Issues:

1. **Extensions not loading**
   - Add `?dev=true` to URL to see loading logs
   - Check browser console for error messages
   - Ensure you restarted TypingMind after installation

2. **Some extensions missing functionality**
   - Use Dynamic Loader for full functionality
   - Embedded Bundle contains simplified versions

3. **Loading takes too long**
   - Use `?exclude=cloud-backup` to skip heavy extensions
   - Use Embedded Bundle for faster loading

4. **Want to update extensions**
   - Dynamic Loader updates automatically
   - Embedded Bundle requires reinstallation
   - Manual paste requires re-copying new code

### Debug Information:

Add `?dev=true` to any URL to enable:
- Detailed loading logs
- Debug objects in console
- Verbose error messages

## 🔒 Security Considerations

- **Dynamic Loader**: Downloads code from GitHub on each load
- **Embedded Bundle**: All code is pre-reviewed and embedded
- **Manual Paste**: You can review all code before installation

All methods provide the same security warning: Extensions have full access to TypingMind data and functionality.

## 📝 Customization

To create your own custom bundle:

1. Copy `embedded-extensions.js`
2. Modify the `enabledByDefault` array
3. Add/remove extensions from the bundle
4. Host on your own server or use as manual paste

## ✅ Recommendation

**For most users**: Use the **Dynamic Loader** approach with:
```
https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js?exclude=cloud-backup
```

This gives you:
- All latest extensions automatically
- Full functionality 
- Excludes the heavy cloud backup extension
- Easy updates when new extensions are added