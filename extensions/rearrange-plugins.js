/**
 * Trello-Style Plugin Reorder Extension for TypingMind
 * 
 * Enables drag-and-drop reordering of plugins in the chat dropdown menu with Trello-style
 * visual feedback. Features auto-scrolling when dragging near list boundaries and persistent
 * order storage across sessions.
 * 
 * @author Unknown
 * @version 1.0.0
 * @created 2025-06-25
 * @updated 2025-01-03
 * @category extension
 * @requires None
 * @compatibility TypingMind Web, macOS, Mobile PWA
 * 
 * Features:
 * - Trello-style drag-and-drop interface with visual feedback
 * - Auto-scroll when dragging near top/bottom of list
 * - Persistent plugin order via localStorage
 * - Smooth animations and visual placeholders
 * - Handle-based dragging with grip icon
 * - Collision detection and smart positioning
 * 
 * Installation:
 * 1. Go to TypingMind → Preferences → Advanced Settings → Extensions
 * 2. Add extension URL or paste code directly
 * 3. Restart TypingMind for changes to take effect
 * 
 * Usage:
 * 1. Open any chat with plugins available
 * 2. Click the plugin dropdown menu
 * 3. Drag plugins by their grip handles to reorder
 * 4. Order is automatically saved and persists across sessions
 * 
 * Configuration:
 * - Auto-scroll edge distance: 40px (configurable in code)
 * - Plugin order stored in localStorage: tm_plugin_custom_order
 * 
 * Storage:
 * - tm_plugin_custom_order: Array of plugin names in custom order
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
        STORAGE_KEY: 'tm_plugin_custom_order',
        STYLE_ID: 'rearrange-plugins-style',
        SELECTORS: {
            list: '[id^="headlessui-menu-items-"] div.overflow-y-auto.custom-scrollbar',
            row: '[role="menuitem"]',
            wrap: '.flex.items-center.justify-center.gap-2.truncate'
        },
        CLASSES: {
            handle: 'tm-plugin-reorder-handle',
            placeholder: 'tm-plugin-reorder-placeholder',
            dragging: 'tm-plugin-reorder-dragging'
        },
        DRAG: {
            edgeDistance: 40 // auto-scroll trigger region (px)
        }
    };

    // Utility functions
    const Utils = {
        log: (message) => console.log(`[PluginSorter] ${message}`),
        
        safe: (fn, context = 'unknown') => {
            try {
                return fn();
            } catch (e) {
                console.error(`[PluginSorter] Error in ${context}:`, e);
                return null;
            }
        }
    };

    /* ­­­­­­­­­ tiny storage helper ­­­­­­­­­ */
    class Store {
      constructor(key) { this.key = key; }
      get()  { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
      save(o){ localStorage.setItem(this.key, JSON.stringify(o)); }
    }
  
    /* ­­­­­­­­­ main sorter ­­­­­­­­­ */
    class Sorter {
  
      constructor() {
        this.store = new Store(CONFIG.STORAGE_KEY);
        this.drag  = {};
        this.#css();
        this.#watch();
      }
  
      /* inject css */
      #css() {
        if (document.getElementById(CONFIG.STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = CONFIG.STYLE_ID;
        style.textContent = `
          .${CONFIG.CLASSES.handle}{cursor:grab;display:flex;align-items:center}
          .${CONFIG.CLASSES.placeholder}{background:#9ab3ff33;border:2px dashed #4880ff;
            border-radius:8px;margin:4px 0;min-height:36px}
          .${CONFIG.CLASSES.dragging}{opacity:.9;transform:rotate(2deg);box-shadow:0 8px 20px #0003}
        `;
        document.head.appendChild(style);
      }
  
      /* observe plugin menus */
      #watch() {
        new MutationObserver(muts=>{
          muts.forEach(m=>{
            m.addedNodes.forEach(n=>{
              const list = n.querySelector?.(CONFIG.SELECTORS.list);
              if(list && !list.dataset.sortAttach) this.#init(list);
            });
          });
        }).observe(document.body,{subtree:true,childList:true});
      }
  
      /* initialise one list */
      #init(list) {
        list.dataset.sortAttach = '1';
        this.#applySaved(list);
        list.querySelectorAll(CONFIG.SELECTORS.row).forEach(r=>this.#grip(r));
        Utils.log('ready');
      }
  
      /* add grip */
      #grip(row) {
        if(row.dataset.hasHandle) return;
        row.dataset.hasHandle='1';
        const h = document.createElement('div');
        h.className = CONFIG.CLASSES.handle;
        h.innerHTML = `<svg class="w-5 h-5 text-slate-400" width="18" height="18" viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round"><circle cx="6.75" cy="3.75" r=".75"/><circle cx="6.75" cy="9" r=".75"/>
          <circle cx="6.75" cy="14.25" r=".75"/><circle cx="11.25" cy="3.75" r=".75"/>
          <circle cx="11.25" cy="9" r=".75"/><circle cx="11.25" cy="14.25" r=".75"/></g></svg>`;
        h.onpointerdown = e => this.#down(e,row);
        row.querySelector(CONFIG.SELECTORS.wrap)?.prepend(h);
      }
  
      /* start drag */
      #down(e,row){
        e.preventDefault();
        const list=row.closest(CONFIG.SELECTORS.list);
        const rect=row.getBoundingClientRect();
        const ph=document.createElement('div');
        ph.className=CONFIG.CLASSES.placeholder;
        ph.style.height=`${rect.height}px`;
        row.before(ph);
  
        Object.assign(row.style,{
          width:`${rect.width}px`,position:'fixed',zIndex:999,
          left:`${rect.left}px`,top:`${rect.top}px`,pointerEvents:'none'
        });
        row.classList.add(CONFIG.CLASSES.dragging);
  
        this.drag={
          row,list,ph,
          offX:e.clientX-rect.left,
          offY:e.clientY-rect.top,
          edge:CONFIG.DRAG.edgeDistance   // auto-scroll trigger region (px)
        };
        document.onpointermove=this.#move.bind(this);
        document.onpointerup  =this.#up.bind(this);
      }
  
      /* move */
      #move(e){
        const {row,ph,offX,offY,list,edge}=this.drag;
        row.style.left=`${e.clientX-offX}px`;
        row.style.top =`${e.clientY-offY}px`;
  
        /* auto-scroll: if near top/bottom, scroll container */
        const r=list.getBoundingClientRect();
        if(e.clientY < r.top + edge)        list.scrollTop -= edge;                // scroll up
        else if(e.clientY > r.bottom - edge) list.scrollTop += edge;               // scroll down
  
        /* reposition placeholder */
        [...list.querySelectorAll(CONFIG.SELECTORS.row)]
          .filter(i=>i!==row)
          .some(item=>{
            const ir=item.getBoundingClientRect();
            if(e.clientY>ir.top && e.clientY<ir.bottom){
              (e.clientY<ir.top+ir.height/2?item.before(ph):item.after(ph));
              return true;
            }
            return false;
          });
      }
  
      /* finish drag */
      #up(){
        const {row,ph,list}=this.drag;
        ph.replaceWith(row);
        row.classList.remove(CONFIG.CLASSES.dragging);
        Object.assign(row.style,{position:'',left:'',top:'',width:'',pointerEvents:''});
        this.#save(list);
        document.onpointermove=document.onpointerup=null;
        this.drag={};
      }
  
      /* save order */
      #save(list){
        const order=[...list.querySelectorAll(CONFIG.SELECTORS.row)]
          .map(r=>r.querySelector('.truncate')?.textContent.trim())
          .filter(Boolean);
        this.store.save(order);
      }
  
      /* apply saved order */
      #applySaved(list){
        const saved=this.store.get();
        if(!saved.length) return;
        const map=new Map();
        list.querySelectorAll(CONFIG.SELECTORS.row).forEach(r=>{
          const n=r.querySelector('.truncate')?.textContent.trim();
          if(n) map.set(n,r);
        });
        saved.forEach(n=>{ const el=map.get(n); if(el) list.appendChild(el); });
      }
    }
  
    new Sorter();  // boot
  })();
  