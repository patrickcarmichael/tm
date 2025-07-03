/**
 * XML Tag Creator Extension for TypingMind
 * 
 * Wraps text or code in custom XML tags via a modal interface with toolbar integration.
 * Features tag history, CDATA support, sanitization, and seamless React integration
 * for consistent prompt structuring without manual XML typing.
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
 * - Modal interface with toolbar button integration
 * - Recent tags history (10 most recent, stored in localStorage)
 * - XML tag name sanitization for valid XML compliance
 * - CDATA wrapping option for code blocks
 * - Code block integration with language specification
 * - Space-to-underscore conversion for tag names
 * - React-compatible value setting with proper event firing
 * - MutationObserver for UI re-rendering compatibility
 * 
 * Installation:
 * 1. Go to TypingMind → Preferences → Advanced Settings → Extensions
 * 2. Add extension URL or paste code directly
 * 3. Restart TypingMind for changes to take effect
 * 
 * Usage:
 * 1. Click "Wrap in XML Tag" button in chat input toolbar
 * 2. Enter tag name (auto-sanitized) or select from recent tags
 * 3. Paste or type content to wrap
 * 4. Toggle CDATA wrapping if needed
 * 5. Click Insert to add formatted XML to chat input
 * 
 * Configuration:
 * - Max recent tags: 10 (configurable in code)
 * - Tag sanitization rules: lowercase, alphanumeric + hyphens/underscores
 * - Invalid tag name prefixes handled automatically
 * 
 * Storage:
 * - xml_tag_creator_recent_tags: Array of recent tag names in localStorage
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
    STORAGE_KEY: 'xml_tag_creator_recent_tags',
    MAX_RECENTS: 10,
    SELECTORS: {
      chatInput: '#chat-input-textbox',
      toolbar: '[data-element-id="chat-input-actions"] .flex.items-center',
      voiceBtn: '[data-element-id="voice-input-button"]',
      insertBtn: '[data-element-id="insert-code-button"]',
      root: '#app'
    },
    BUTTON: {
      elementId: 'insert-code-button',
      tooltipId: 'global',
      tooltipContent: 'Wrap in XML Tag'
    }
  };

  // Utility functions
  const Utils = {
    log: (message) => console.log(`[XmlTagCreator] ${message}`),
    
    safe: (fn, context = 'unknown') => {
      try {
        return fn();
      } catch (e) {
        console.error(`[XmlTagCreator] Error in ${context}:`, e);
        return null;
      }
    }
  };

  class XmlTagCreator {

    /* ─── Static helpers ──────────────────── */
    /**
     * Normalises a raw string so it is safe for use as an XML tag name.
     *
     * @param {string} tag        Raw user input.
     * @param {boolean} trimEdges When true (default) leading/trailing
     *                            underscores produced by the replacement
     *                            step are removed. Pass false while the user
     *                            is typing so that underscores replacing
     *                            spaces are visible immediately.
     */
    static sanitize(tag = '', trimEdges = true) {
      let clean = tag
        .toLowerCase()
        // replace invalid characters (including space) with underscore
        .replace(/[^a-z0-9_-]+/g, '_')
        // collapse multiple underscores that may appear after successive
        // space-presses (or other invalid chars) into a single one
        .replace(/_+/g, '_');

      if (trimEdges) clean = clean.replace(/^_+|_+$/g, '');

      if (!clean || clean === 'code') return '';
      if (clean.startsWith('xml') || !/^[a-z_]/.test(clean)) clean = `_${clean}`;
      return clean;
    }

    /** Sets value on controlled <textarea>/<input> and triggers React's onChange */
    static setValue(el, v) {
      const setter = Object.getOwnPropertyDescriptor(el.__proto__, 'value')?.set;
      setter ? setter.call(el, v) : (el.value = v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }

    /* ─── Construction / state ────────────── */
    constructor() {

      this.state = {
        useCDATA     : false,
        useCodeBlock : false,
        codeLang     : '',
        recent       : this.loadRecents(),
        overlay      : null
      };

      this.init();
    }

    /* ─── localStorage (recent tags) ──────── */
    loadRecents() {
      try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) ?? []; }
      catch { return []; }
    }
    saveRecents() {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.state.recent));
    }
    pushRecent(tag) {
      if (!tag) return;
      this.state.recent = [tag, ...this.state.recent.filter(t => t !== tag)]
                          .slice(0, CONFIG.MAX_RECENTS);
      this.saveRecents();
    }

    /* ─── DOM factory ─────────────────────── */
    el(tag, cls = '', text = '', attrs = {}, ...kids) {
      const e = document.createElement(tag);
      if (cls ) e.className = cls;
      if (text) e.textContent = text;
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      kids.forEach(k => k && e.append(k));
      return e;
    }

    /* ─── Modal UI ────────────────────────── */
    buildModal() {
      // Reset state for a fresh modal
      this.state.useCodeBlock = true;
      this.state.useCDATA = false;
      this.state.codeLang = '';

      /* shell */
      const overlay = this.el('div',
        'fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center');
      const modal = this.el('div',
        'bg-white dark:bg-slate-900 p-6 rounded-lg shadow-2xl max-w-2xl w-full mx-4 border border-slate-200 dark:border-slate-700');
      overlay.append(modal);

      /* inputs */
      const tag   = this.el('input',
        'w-full p-2 mb-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md',
        '', { placeholder: 'XML Tag Name' });
      const hint  = this.el('div',
        'hidden text-xs text-slate-500 dark:text-slate-400 mb-4',
        'Only letters, numbers, hyphens, underscores. Must start with letter or _.');

      modal.append(tag, hint);

      /* space-to-underscore (fast path) */
      tag.addEventListener('keydown', e => {
        if (e.key !== ' ') return;
        e.preventDefault();

        const { selectionStart, selectionEnd, value } = tag;

        // If the character immediately before the caret is already an underscore
        // we don't need (or want) another one.
        if (selectionStart === selectionEnd && value[selectionStart - 1] === '_') {
          return;
        }

        const newVal = value.slice(0, selectionStart) + '_' + value.slice(selectionEnd);
        tag.value = newVal;

        const cur = selectionStart + 1;
        tag.setSelectionRange(cur, cur);

        // Trigger the input listener manually so the hint visibility updates.
        tag.dispatchEvent(new Event('input', { bubbles: true }));
      });

      /* recent tags – TOP position */
      if (this.state.recent.length) {
        const wrap = this.el('div', 'mb-4');
        const header = this.el('div', 'flex justify-between items-center mb-2');
        const label = this.el('div', 'text-xs text-slate-500 dark:text-slate-400', 'Recent tags:');
        const clearBtn = this.el('button', 'text-xs text-blue-600 dark:text-blue-400 hover:underline', 'Clear');
        clearBtn.type = 'button';
        clearBtn.onclick = () => {
          this.state.recent = [];
          this.saveRecents();
          wrap.remove();
        };
        header.append(label, clearBtn);
        wrap.append(header);

        const cloud = this.el('div', 'flex flex-wrap gap-2');
        this.state.recent.forEach(t => {
          const b = this.el('button',
            'px-2 py-1 bg-slate-200 dark:bg-slate-700 text-xs rounded-md hover:bg-slate-300 dark:hover:bg-slate-600',
            t);
          b.onclick = () => { XmlTagCreator.setValue(tag, t); code.focus(); };
          cloud.append(b);
        });
        wrap.append(cloud);
        modal.append(wrap);
      }

      /* code textarea */
      const code  = this.el('textarea',
        'w-full h-48 p-2 mb-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-sm',
        '', { placeholder: 'Paste your code here…' });
      modal.append(code);

      /* footer */
      const foot  = this.el('div', 'flex items-center justify-between');
      const toggleContainer = this.el('div', 'flex flex-col gap-2');

      /* -- Row 1: Code block -- */
      const codeBlockRow = this.el('div', 'flex items-center gap-2');
      const bIn   = this.el('input','h-4 w-4 cursor-pointer','', { type:'checkbox', id:'codeblock' });
      bIn.checked = this.state.useCodeBlock;
      const bLab  = this.el('label','text-sm cursor-pointer','Code block',{ for:'codeblock' });
      const langIn = this.el('input','w-20 p-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs','', { placeholder:'lang' });
      langIn.value = this.state.codeLang;
      langIn.style.display = this.state.useCodeBlock ? '' : 'none';
      codeBlockRow.append(bLab, bIn, langIn);

      /* -- Row 2: CDATA -- */
      const cdataRow = this.el('div', 'flex items-center gap-2');
      const cIn   = this.el('input','h-4 w-4 cursor-pointer','', { type:'checkbox', id:'cdata' });
      cIn.checked = this.state.useCDATA;
      const cLab  = this.el('label','text-sm cursor-pointer','CDATA',{ for:'cdata' });
      cdataRow.append(cLab, cIn);

      toggleContainer.append(codeBlockRow, cdataRow);

      const insert = this.el('button',
        'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
        'Insert');
      foot.append(toggleContainer, insert);
      modal.append(foot);

      /* mount + events */
      document.body.append(overlay);
      this.state.overlay = overlay;
      tag.focus();

      /* live validation: keep underscores visible while typing */
      tag.addEventListener('input', () => {
        const clean = XmlTagCreator.sanitize(tag.value, false);
        if (tag.value !== clean) tag.value = clean;
        hint.classList.toggle('hidden', !tag.value);
      });

      /* tab handler */
      tag.addEventListener('keydown', e => {
        if (e.key === 'Tab' && !e.shiftKey) {
          e.preventDefault();
          code.focus();
        }
      });

      /* toggle listeners */
      cIn.onchange   = e => (this.state.useCDATA     = e.target.checked);
      bIn.onchange   = e => {
        this.state.useCodeBlock = e.target.checked;
        langIn.style.display = this.state.useCodeBlock ? '' : 'none';
      };
      langIn.oninput = e => (this.state.codeLang     = e.target.value.trim());

      /* insert logic */
      const doInsert = () => {
        if (!code.value.trim()) return alert('Please paste your code.');
        const xmlTag  = XmlTagCreator.sanitize(tag.value) || 'code';
        this.pushRecent(xmlTag);
        let inner = code.value;
        if (this.state.useCodeBlock) {
          const lang = this.state.codeLang || '';
          inner = '```' + lang + '\n' + inner + '\n```';
        }
        const snippet = this.state.useCDATA
          ? `<${xmlTag}>\n<![CDATA[\n${inner}\n]]>\n</${xmlTag}>`
          : `<${xmlTag}>\n${inner}\n</${xmlTag}>`;

        const tb = document.querySelector(CONFIG.SELECTORS.chatInput);
        if (!tb) return;
        const { value, selectionStart } = tb;
        const newVal = value.slice(0, selectionStart) + snippet + value.slice(selectionStart);
        XmlTagCreator.setValue(tb, newVal);
        const cur = selectionStart + snippet.length;
        tb.focus();
        tb.setSelectionRange(cur, cur);
        close();
      };

      insert.onclick = doInsert;
      tag.addEventListener('keydown',  e => e.key === 'Enter' && (e.preventDefault(), doInsert()));
      code.addEventListener('keydown', e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), doInsert()));

      const close = () => { overlay.remove(); document.removeEventListener('keydown', esc); };
      const esc   = e => e.key === 'Escape' && close();
      document.addEventListener('keydown', esc);
      overlay.addEventListener('click', e => e.target === overlay && close());
    }

    /* ─── Toolbar button ───────────────────── */
    addToolbarBtn() {
      const bar = document.querySelector(CONFIG.SELECTORS.toolbar);
      if (!bar || bar.querySelector(CONFIG.SELECTORS.insertBtn)) return;

      const btn = this.el('button',
        'group/canvas-btn relative w-9 h-9 rounded-lg text-slate-900 dark:text-white hover:bg-slate-900/20 dark:hover:bg-white/20 flex items-center justify-center',
        '');
      btn.type = 'button';
      btn.dataset.elementId      = CONFIG.BUTTON.elementId;
      btn.dataset.tooltipId      = CONFIG.BUTTON.tooltipId;
      btn.dataset.tooltipContent = CONFIG.BUTTON.tooltipContent;
      btn.innerHTML = `
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
             stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>`;
      btn.onclick = () => this.buildModal();

      const voice = bar.querySelector(CONFIG.SELECTORS.voiceBtn);
      bar.insertBefore(btn, voice?.nextSibling ?? null);
    }

    /* ─── Keep button alive on re-render ──── */
    observeToolbar() {
      const root = document.querySelector(CONFIG.SELECTORS.root) || document.body;
      new MutationObserver(() => this.addToolbarBtn())
        .observe(root, { childList: true, subtree: true });
    }

    /* ─── Init ────────────────────────────── */
    init() {
      const ready = () => { this.addToolbarBtn(); this.observeToolbar(); };
      document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', ready)
        : ready();
    }
  }

  /* bootstrap */
  new XmlTagCreator();
})();
