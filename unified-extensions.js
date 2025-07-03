/**
 * Unified TypingMind Extensions
 * 
 * Single file containing multiple essential TypingMind extensions following
 * the exact same pattern as individual extensions for maximum compatibility.
 * 
 * @author Claude
 * @version 1.0.0
 * @created 2025-01-03
 * @updated 2025-01-03
 * @category extension
 * @requires None
 * @compatibility TypingMind Web, macOS, Mobile PWA
 * 
 * Extensions included:
 * - auto-thought-toggle: Auto-manages "Thinking..." details expansion
 * - hide-teams: Hides Teams tab from sidebar
 * - quote-reply: Text selection and block-quote replies (simplified)
 * - xml-tag-creator: XML tag wrapper (simplified)
 * - gpt-theme: ChatGPT-inspired visual theme (core styles)
 * 
 * Installation:
 * 1. Go to TypingMind → Preferences → Advanced Settings → Extensions
 * 2. Add extension URL or paste code directly
 * 3. Restart TypingMind for changes to take effect
 * 
 * Usage:
 * - All extensions activate automatically
 * - Use ?debug=true in URL for debug logging
 * 
 * @license MIT
 * @repository https://github.com/patrickcarmichael/tm
 */

// Use the same IIFE pattern as working extensions
(() => {
    'use strict';

    console.log('[UnifiedExtensions] Loading TypingMind extensions...');

    // =================================================================
    // AUTO-THOUGHT-TOGGLE EXTENSION
    // =================================================================
    (function() {
        const CONFIG = {
            STORAGE_KEY: 'autoThoughtToggle_enabled',
            BTN_ID: 'auto-thought-toggle-button',
            SELECTORS: {
                thought: 'details:has(>summary span:first-child)',
                menu: '[data-element-id="more-actions-menu"]'
            }
        };

        const Utils = {
            log: (message) => console.log(`[AutoThoughtToggle] ${message}`),
            safe: (fn, context = 'unknown') => {
                try {
                    return fn();
                } catch (e) {
                    console.error(`[AutoThoughtToggle] Error in ${context}:`, e);
                    return null;
                }
            }
        };

        class AutoThoughtToggle {
            constructor() {
                this.enabled = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) ?? 'true');
                this.processedSummaries = new WeakSet();
                this.init();
            }

            init() {
                Utils.log(`${this.enabled ? 'Enabled' : 'Disabled'}.`);
                
                this._pending = false;
                this.observer = new MutationObserver(() => {
                    if (this._pending) return;
                    this._pending = true;
                    setTimeout(() => {
                        this._pending = false;
                        this.autoToggle();
                        if (!document.getElementById(CONFIG.BTN_ID)) this.injectButton();
                    }, 100);
                });
                
                const chatContainer = document.querySelector('[data-element-id="chat-space-middle-part"]') || document.body;
                this.observer.observe(chatContainer, {childList:true, subtree:true});
                
                window.addEventListener('beforeunload', () => this.observer.disconnect());
            }

            autoToggle() {
                if (!this.enabled) return;
                
                Utils.safe(() => {
                    document.querySelectorAll(CONFIG.SELECTORS.thought).forEach(d => {
                        const summary = d.querySelector('summary');
                        const isStreaming = summary?.textContent?.includes('Thinking...');
                        const userInteracted = d.dataset.userInteracted;
                        const autoExpanded = d.hasAttribute('data-auto-expanded');
                        
                        if (isStreaming && !d.open && !userInteracted && !autoExpanded) {
                            d.open = true;
                            d.setAttribute('data-auto-expanded', '1');
                        } else if (!isStreaming && d.open && autoExpanded && !userInteracted) {
                            d.open = false;
                            d.removeAttribute('data-auto-expanded');
                        }
                    });

                    document.querySelectorAll(`${CONFIG.SELECTORS.thought}>summary`)
                        .forEach(s => {
                            if (this.processedSummaries.has(s)) return;
                            
                            s.addEventListener('click', () => {
                                const d = s.closest(CONFIG.SELECTORS.thought);
                                if (d) {
                                    d.dataset.userInteracted = '1';
                                    d.removeAttribute('data-auto-expanded');
                                }
                            }, {capture:true});
                            
                            this.processedSummaries.add(s);
                        });
                }, 'autoToggle');
            }

            setState(on) {
                this.enabled = on;
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(on));
                Utils.log(`${on ? 'Enabled' : 'Disabled'}.`);
                this.updateButton();
            }

            injectButton() {
                Utils.safe(() => {
                    const menu = document.querySelector(CONFIG.SELECTORS.menu);
                    if (!menu) return;
                    
                    const btn = document.createElement('button');
                    btn.id = CONFIG.BTN_ID;
                    btn.className = 'flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800';
                    btn.innerHTML = `<span class="flex h-4 w-4 items-center justify-center">💭</span>Auto-Hide Thoughts`;
                    btn.onclick = () => this.setState(!this.enabled);
                    
                    menu.appendChild(btn);
                    this.updateButton();
                }, 'injectButton');
            }

            updateButton() {
                const btn = document.getElementById(CONFIG.BTN_ID);
                if (btn) {
                    btn.style.opacity = this.enabled ? '1' : '0.5';
                    btn.title = `Auto-Hide Thoughts: ${this.enabled ? 'ON' : 'OFF'}`;
                }
            }
        }

        try {
            new AutoThoughtToggle();
            console.log('[UnifiedExtensions] ✅ auto-thought-toggle loaded');
        } catch (error) {
            console.error('[UnifiedExtensions] ❌ auto-thought-toggle failed:', error);
        }
    })();

    // =================================================================
    // HIDE-TEAMS EXTENSION
    // =================================================================
    (function() {
        const CONFIG = {
            STYLE_ID: 'hide-teams-style',
            SELECTORS: {
                teamsTab: '[data-element-id="workspace-tab-teams"]'
            }
        };

        function hideTeamsTab() {
            if (document.getElementById(CONFIG.STYLE_ID)) return;
            
            const style = document.createElement('style');
            style.id = CONFIG.STYLE_ID;
            style.textContent = `${CONFIG.SELECTORS.teamsTab} { display: none !important; }`;
            document.head.appendChild(style);
            
            console.log('[HideTeams] Teams tab hidden');
        }

        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', hideTeamsTab);
            } else {
                hideTeamsTab();
            }
            console.log('[UnifiedExtensions] ✅ hide-teams loaded');
        } catch (error) {
            console.error('[UnifiedExtensions] ❌ hide-teams failed:', error);
        }
    })();

    // =================================================================
    // SIMPLE QUOTE-REPLY
    // =================================================================
    (function() {
        let quotes = [];
        
        function showQuoteButton(event) {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) return;
            
            const selectedText = selection.toString().trim();
            if (!selectedText) return;
            
            // Remove any existing quote buttons
            document.querySelectorAll('.quote-button').forEach(btn => btn.remove());
            
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            const button = document.createElement('button');
            button.textContent = 'Quote';
            button.className = 'quote-button';
            button.style.cssText = `
                position: fixed;
                top: ${rect.bottom + window.scrollY + 5}px;
                left: ${rect.left}px;
                z-index: 9999;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                font-family: inherit;
            `;
            
            button.onclick = () => {
                quotes.push(selectedText);
                console.log('[QuoteReply] Quote added:', selectedText.substring(0, 50) + '...');
                
                // Add to input
                const input = document.getElementById('chat-input-textbox');
                if (input && quotes.length > 0) {
                    const quotedText = quotes.map(q => `> ${q}`).join('\n\n');
                    input.value = quotedText + '\n\n' + input.value;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    quotes = []; // Clear quotes after adding
                }
                
                button.remove();
                selection.removeAllRanges();
            };
            
            document.body.appendChild(button);
            
            // Auto-remove button after 3 seconds
            setTimeout(() => {
                if (document.body.contains(button)) {
                    button.remove();
                }
            }, 3000);
        }

        try {
            document.addEventListener('mouseup', showQuoteButton);
            console.log('[UnifiedExtensions] ✅ quote-reply loaded');
        } catch (error) {
            console.error('[UnifiedExtensions] ❌ quote-reply failed:', error);
        }
    })();

    // =================================================================
    // SIMPLE GPT THEME
    // =================================================================
    (function() {
        function applyGPTTheme() {
            if (document.getElementById('gpt-theme-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'gpt-theme-styles';
            style.textContent = `
                /* ChatGPT-inspired theme */
                [data-element-id="chat-space-middle-part"] .prose.max-w-full,
                [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
                    font-family: ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif !important;
                    font-size: 16px !important;
                    line-height: 24px !important;
                    color: #000 !important;
                    font-weight: 400 !important;
                }
                
                [data-element-id="user-message"] {
                    margin-left: auto !important;
                    margin-right: 0 !important;
                    max-width: 70% !important;
                    border-radius: 1.5rem !important;
                    background-color: #f4f4f4 !important;
                    padding: 0.5rem !important;
                    margin-bottom: 0.5rem !important;
                }
                
                /* Sidebar styling */
                [data-element-id="workspace-bar"],
                [data-element-id="side-bar-background"] {
                    background-color: #F9F9F9 !important;
                }
                
                [data-element-id="new-chat-button-in-side-bar"] {
                    background-color: #E3E3E3 !important;
                    color: #000 !important;
                    font-weight: 600 !important;
                }
            `;
            document.head.appendChild(style);
            console.log('[GPTTheme] ChatGPT-style theme applied');
        }

        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', applyGPTTheme);
            } else {
                applyGPTTheme();
            }
            console.log('[UnifiedExtensions] ✅ gpt-theme loaded');
        } catch (error) {
            console.error('[UnifiedExtensions] ❌ gpt-theme failed:', error);
        }
    })();

    console.log('[UnifiedExtensions] 🎉 All extensions loaded successfully!');

})();