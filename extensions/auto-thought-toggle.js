/**
 * Auto-Hide Thinking Toggle for TypingMind
 * 
 * Automatically manages "Thinking..." details expansion during AI response generation.
 * Opens thinking details during generation, collapses when response starts, and provides
 * a toggle control in the "More actions" menu with persistent localStorage settings.
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
 * - Auto-opens streaming "Thinking..." details during generation
 * - Auto-collapses when actual response begins
 * - Toggle button in "More actions" menu
 * - Persistent settings via localStorage
 * - Console helper functions for debugging
 * - Respects manual user interactions
 * 
 * Installation:
 * 1. Go to TypingMind → Preferences → Advanced Settings → Extensions
 * 2. Add extension URL or paste code directly
 * 3. Restart TypingMind for changes to take effect
 * 
 * Usage:
 * - Extension works automatically after installation
 * - Toggle via "More actions" menu → "Auto‑Hide Thoughts"
 * - Console commands: autoThoughtToggle.enable(), disable(), status()
 * 
 * Configuration:
 * - Settings stored in localStorage key: autoThoughtToggle_enabled
 * - Default: enabled (true)
 * 
 * Storage:
 * - autoThoughtToggle_enabled: boolean preference in localStorage
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
        STORAGE_KEY: 'autoThoughtToggle_enabled',
        BTN_ID: 'auto-thought-toggle-button',
        SELECTORS: {
            thought: '[data-element-id="ai-response"] details',
            content: '[data-element-id="ai-response"]>*:not(details):not([data-element-id="additional-actions-of-response-container"])',
            menu: '[role="menu"][aria-labelledby*="headlessui-menu-button"]',
            menuItem: '[role="menuitem"]'
        },
        ICONS: {
            checked: '<svg class="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            unchecked: '<svg class="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/></svg>'
        }
    };

    // Utility functions
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

    /* ---------- Main Class ------------------------------------------------------ */
    class AutoThoughtToggle {
  
      constructor() {
        /* read persisted state as real boolean, defaulting to true */
        this.enabled = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) ?? 'true');
        
        // PERFORMANCE: Use WeakSet instead of dataset to track processed elements
        this.processedSummaries = new WeakSet();
        
        this.#init();
      }
  
      /** master initialiser */
      #init() {
        Utils.log(`${this.enabled ? 'Enabled' : 'Disabled'}.`);
  
        /* DOM observer with light throttling */
        this._pending = false;
        this.observer = new MutationObserver(() => {
          if (this._pending) return;
          this._pending = true;
          setTimeout(() => {
            this._pending = false;
            this.#autoToggle();
            if (!document.getElementById(CONFIG.BTN_ID)) this.#injectButton();
          }, 100); // 100ms debounce to reduce frequent scans
        });
        // PERFORMANCE: Try to observe a more specific container, fallback to body
        const chatContainer = document.querySelector('[data-element-id="chat-space-middle-part"]') || document.body;
        this.observer.observe(chatContainer, {childList:true,subtree:true});
  
        /* cleanup to avoid duplicate observers on navigation */
        window.addEventListener('beforeunload', () => this.observer.disconnect());
  
        /* console helpers - only expose in development mode */
        const isDevMode = new URLSearchParams(window.location.search).has('dev');
        if (isDevMode) {
          window.autoThoughtToggle = {
            enable : () => this.#setState(true),
            disable: () => this.#setState(false),
            status : () => console.log(`Auto‑Hide Thoughts is ${this.enabled?'ENABLED':'DISABLED'}.`)
          };
        }
      }
  
      /** change feature state & UI */
      #setState(on) {
        this.enabled = on;
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(on));
        Utils.log(`${on?'Enabled':'Disabled'}.`);
        this.#updateButtonIcon();
      }
  
      /** open/collapse "Thinking…" blocks */
      #autoToggle() {
        if (!this.enabled) return;
  
        /* collapse blocks whose answer started */
        document.querySelectorAll('details[data-auto-expanded]').forEach(d => {
          const next = d.nextElementSibling;
          if (next && next.matches(CONFIG.SELECTORS.content)) {
            d.open = false;
            d.removeAttribute('data-auto-expanded');
          }
        });
  
        /* manage new "Thinking…" blocks */
        document.querySelectorAll(CONFIG.SELECTORS.thought).forEach(d => {
          if (d.dataset.autoExpanded || d.dataset.userInteracted) return;
  
          const label = d.querySelector('summary')?.textContent || '';
          if (!/Thinking|Thought/i.test(label)) return;
  
          d.open = true;
          d.dataset.autoExpanded = '1';
  
          /* collapse immediately if answer already there */
          const next = d.nextElementSibling;
          if (next && next.matches(CONFIG.SELECTORS.content)) {
            d.open = false;
            d.removeAttribute('data-auto-expanded');
          }
        });
  
        /* track manual clicks to stop auto‑handling */
        document.querySelectorAll(`${CONFIG.SELECTORS.thought}>summary`)
          .forEach(s => {
            if (this.processedSummaries.has(s)) return; // Skip if already processed
            
            s.addEventListener('click', () => {
              const d = s.closest(CONFIG.SELECTORS.thought);
              if (d) {
                d.dataset.userInteracted = '1';
                d.removeAttribute('data-auto-expanded');
              }
            }, {capture:true});
            
            this.processedSummaries.add(s); // Add to WeakSet instead of using dataset
          });
      }
  
      /** add toggle entry to "More actions" menu */
      #injectButton() {
        // Find all menus on the page that could be our target.
        const menus = document.querySelectorAll(CONFIG.SELECTORS.menu);
        if (!menus.length) return;

        // Find the specific "More Actions" menu by looking for a unique item
        // it contains, like the "Delete Chat" button. This prevents us from
        // ever targeting the wrong menu (e.g., the plugin menu).
        let targetMenu = null;
        for (const menu of menus) {
          const menuItems = menu.querySelectorAll('span.text-left');
          for (const item of menuItems) {
            if (item.textContent?.includes('Reset chat')) {
              targetMenu = menu;
              break;
            }
          }
          if (targetMenu) break;
        }

        // If we didn't find the correct menu, abort.
        if (!targetMenu) return;

        // Prevent duplicate buttons from being injected.
        if (targetMenu.querySelector(`#${CONFIG.BTN_ID}`)) return;

        const template = targetMenu.querySelector(CONFIG.SELECTORS.menuItem);
        if (!template) return;
  
        const btn = template.cloneNode(true);
        btn.id = CONFIG.BTN_ID;
        btn.removeAttribute('data-headlessui-state');
  
        btn.querySelector('span.text-left').textContent = 'Auto‑Hide Thoughts';
        btn.querySelector('.font-normal.text-slate-500')?.remove();
        btn.querySelector('div:has(svg[data-tooltip-id="global"])')?.remove();
        btn.addEventListener('click', () => this.#setState(!this.enabled));
  
        targetMenu.appendChild(btn);
        this.#updateButtonIcon();
      }
  
      /** swap checkbox icon inside the menu entry */
      #updateButtonIcon() {
        const btn  = document.getElementById(CONFIG.BTN_ID);
        if (!btn) return;
  
        const box  = btn.querySelector('.flex.items-center.justify-center.gap-x-2');
        const svg  = box?.querySelector('svg');
        if (!svg) return;
  
        svg.outerHTML = this.enabled ? CONFIG.ICONS.checked : CONFIG.ICONS.unchecked;
      }
    }
  
    /* bootstrap */
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', () => new AutoThoughtToggle())
      : new AutoThoughtToggle();
})(); 
  