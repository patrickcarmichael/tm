/**
 * Simple Extension Loader for TypingMind
 * 
 * Loads all TypingMind extensions and themes sequentially with basic error handling.
 * This is a simplified, robust version that should work reliably.
 * 
 * @author Claude
 * @version 1.0.0
 * @created 2025-01-03
 * @updated 2025-01-03
 * @category loader
 * @requires None
 * @compatibility TypingMind Web, macOS, Mobile PWA
 */

(function() {
    'use strict';
    
    console.log('[SimpleLoader] Starting TypingMind extension loading...');
    
    // Base configuration
    var BASE_URL = 'https://raw.githubusercontent.com/patrickcarmichael/tm/main';
    var EXTENSIONS = [
        'extensions/plugin-js-zip.js',           // Load dependency first
        'extensions/hide-teams.js',
        'extensions/auto-thought-toggle.js', 
        'extensions/quote-reply.js',
        'extensions/rearrange-plugins.js',
        'extensions/xml-tag-creator.js',
        'extensions/plugin-export-chats.js',    // Depends on plugin-js-zip
        'themes/gpt.js',
        'themes/ui-tweaks.js'
        // Note: cloud-backup.js excluded by default due to size
    ];
    
    var loadedCount = 0;
    var totalCount = EXTENSIONS.length;
    
    // Simple loading function
    function loadExtension(path, index) {
        var script = document.createElement('script');
        script.src = BASE_URL + '/' + path;
        script.async = false; // Maintain order
        
        script.onload = function() {
            loadedCount++;
            var name = path.split('/').pop().replace('.js', '');
            console.log('[SimpleLoader] ✅ Loaded: ' + name + ' (' + loadedCount + '/' + totalCount + ')');
            
            if (loadedCount === totalCount) {
                console.log('[SimpleLoader] 🎉 All extensions loaded successfully!');
            }
        };
        
        script.onerror = function() {
            var name = path.split('/').pop().replace('.js', '');
            console.error('[SimpleLoader] ❌ Failed to load: ' + name);
        };
        
        document.head.appendChild(script);
    }
    
    // Start loading
    function startLoading() {
        console.log('[SimpleLoader] Loading ' + totalCount + ' extensions...');
        
        for (var i = 0; i < EXTENSIONS.length; i++) {
            // Add small delay between loads to prevent overwhelming
            (function(index) {
                setTimeout(function() {
                    loadExtension(EXTENSIONS[index], index);
                }, index * 100); // 100ms between each load
            })(i);
        }
    }
    
    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startLoading);
    } else {
        startLoading();
    }
    
    // Expose for debugging
    window.SimpleExtensionLoader = {
        version: '1.0.0',
        loaded: function() { return loadedCount; },
        total: function() { return totalCount; },
        reload: startLoading
    };
    
})();