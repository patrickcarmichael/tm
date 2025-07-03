/**
 * Hide Teams Tab Extension for TypingMind
 * 
 * Simple extension that hides the "Teams" tab from the workspace sidebar using CSS injection.
 * Provides a clean, minimal approach to removing unwanted UI elements.
 * 
 * @author Unknown
 * @version 1.0.0
 * @created 2024-01-01
 * @updated 2025-01-03
 * @category extension
 * @requires None
 * @compatibility TypingMind Web, macOS, Mobile PWA
 * 
 * Features:
 * - Hides Teams tab from workspace sidebar
 * - CSS injection approach for instant effect
 * - Minimal code footprint (18 lines)
 * - No user configuration required
 * 
 * Installation:
 * 1. Go to TypingMind → Preferences → Advanced Settings → Extensions
 * 2. Add extension URL or paste code directly
 * 3. Restart TypingMind for changes to take effect
 * 
 * Usage:
 * - Extension works automatically after installation
 * - Teams tab will be hidden immediately
 * - No user interaction required
 * 
 * Configuration:
 * - No configuration options available
 * - Modify CSS selector to target different elements
 * 
 * Storage:
 * - No data stored in localStorage
 * - No persistent settings
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
        TARGET_SELECTOR: '[data-element-id="workspace-tab-teams"]',
        STYLE_ID: 'hide-teams-style'
    };

    // Utility functions
    const Utils = {
        log: (message) => console.log(`[HideTeams] ${message}`),
        
        safe: (fn, context = 'unknown') => {
            try {
                return fn();
            } catch (e) {
                console.error(`[HideTeams] Error in ${context}:`, e);
                return null;
            }
        }
    };

    /**
     * Hides the Teams tab by injecting CSS
     */
    function hideTeamsTab() {
        return Utils.safe(() => {
            // Check if style already exists to avoid duplicates
            if (document.getElementById(CONFIG.STYLE_ID)) {
                Utils.log('Style already applied, skipping.');
                return;
            }

            // Create the style element
            const styleElement = document.createElement('style');
            styleElement.id = CONFIG.STYLE_ID;
            
            // Set the CSS content
            styleElement.textContent = `
                ${CONFIG.TARGET_SELECTOR} {
                    display: none !important;
                }
            `;
            
            // Append the style element to the document head
            document.head.appendChild(styleElement);
            Utils.log('Teams tab successfully hidden.');
        }, 'hideTeamsTab');
    }

    // Execute the function
    hideTeamsTab();

})();
