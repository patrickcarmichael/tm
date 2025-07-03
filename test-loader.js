/**
 * Test Extension Loader for TypingMind
 * Simple test to verify extension loading works
 */
(() => {
    'use strict';
    
    console.log('[TestLoader] Extension loaded successfully!');
    console.log('[TestLoader] Starting to load individual extensions...');
    
    // Test loading one simple extension
    const script = document.createElement('script');
    script.src = 'https://raw.githubusercontent.com/patrickcarmichael/tm/main/extensions/hide-teams.js';
    script.onload = () => {
        console.log('[TestLoader] ✅ hide-teams.js loaded successfully');
    };
    script.onerror = () => {
        console.error('[TestLoader] ❌ Failed to load hide-teams.js');
    };
    
    document.head.appendChild(script);
    
    // Expose test function
    window.testExtensionLoader = () => {
        console.log('[TestLoader] Test function working!');
        return 'Extension loader is functional';
    };
    
})();