/**
 * TypingMind All-in-One Extension Loader
 * 
 * Single JavaScript file that loads all TypingMind extensions and themes from the
 * tm repository. Provides centralized loading, error handling, and optional
 * selective loading of specific extensions.
 * 
 * @author Claude
 * @version 1.0.0
 * @created 2025-01-03
 * @updated 2025-01-03
 * @category loader
 * @requires None
 * @compatibility TypingMind Web, macOS, Mobile PWA
 * 
 * Features:
 * - Load all extensions and themes with single URL
 * - Selective loading via URL parameters
 * - Error handling and loading status reporting
 * - Dependency management (e.g., plugin-js-zip.js before plugin-export-chats.js)
 * - Development mode support
 * - Console logging for debugging
 * 
 * Installation:
 * 1. Go to TypingMind → Preferences → Advanced Settings → Extensions
 * 2. Add extension URL: https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js
 * 3. Restart TypingMind for changes to take effect
 * 
 * Usage:
 * - Load all: https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js
 * - Selective: https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js?only=quote-reply,gpt,ui-tweaks
 * - Exclude: https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js?exclude=cloud-backup
 * - Dev mode: https://raw.githubusercontent.com/patrickcarmichael/tm/main/all-extensions.js?dev=true
 * 
 * Configuration:
 * - URL parameters: only, exclude, dev, verbose
 * - Base URL can be modified for different sources
 * 
 * Storage:
 * - No persistent data stored
 * - Individual extensions may store their own data
 * 
 * @license MIT
 * @repository https://github.com/patrickcarmichael/tm
 * @source Original implementation
 * 
 * Security Note: This extension loads multiple other extensions dynamically.
 * Review all source code carefully before installation.
 */

(() => {
    'use strict';

    // Configuration
    const CONFIG = {
        BASE_URL: 'https://raw.githubusercontent.com/patrickcarmichael/tm/main',
        EXTENSIONS: [
            // Dependencies first
            {
                name: 'plugin-js-zip',
                path: 'extensions/plugin-js-zip.js',
                description: 'JSZip library dependency',
                category: 'dependency'
            },
            // Regular extensions
            {
                name: 'auto-thought-toggle',
                path: 'extensions/auto-thought-toggle.js',
                description: 'Auto-manages "Thinking..." details expansion',
                category: 'extension'
            },
            {
                name: 'hide-teams',
                path: 'extensions/hide-teams.js',
                description: 'Hides Teams tab from sidebar',
                category: 'extension'
            },
            {
                name: 'quote-reply',
                path: 'extensions/quote-reply.js',
                description: 'Text selection and block-quote replies',
                category: 'extension'
            },
            {
                name: 'rearrange-plugins',
                path: 'extensions/rearrange-plugins.js',
                description: 'Trello-style plugin drag-and-drop reordering',
                category: 'extension'
            },
            {
                name: 'xml-tag-creator',
                path: 'extensions/xml-tag-creator.js',
                description: 'XML tag wrapper with modal interface',
                category: 'extension'
            },
            // Extensions with dependencies (load after dependencies)
            {
                name: 'plugin-export-chats',
                path: 'extensions/plugin-export-chats.js',
                description: 'Comprehensive chat export system',
                category: 'extension',
                dependencies: ['plugin-js-zip']
            },
            {
                name: 'cloud-backup',
                path: 'extensions/cloud-backup.js',
                description: 'Large cloud backup and restore system',
                category: 'extension'
            },
            // Themes
            {
                name: 'gpt',
                path: 'themes/gpt.js',
                description: 'ChatGPT-inspired visual theme',
                category: 'theme'
            },
            {
                name: 'ui-tweaks',
                path: 'themes/ui-tweaks.js',
                description: 'Comprehensive UI customization system',
                category: 'theme'
            }
        ]
    };

    // Utility functions
    const Utils = {
        log: (message, type = 'info') => {
            const prefix = '[AllExtensions]';
            const timestamp = new Date().toISOString().split('T')[1].slice(0, -5);
            const fullMessage = `${prefix} [${timestamp}] ${message}`;
            
            switch (type) {
                case 'error':
                    console.error(fullMessage);
                    break;
                case 'warn':
                    console.warn(fullMessage);
                    break;
                case 'success':
                    console.log(`%c${fullMessage}`, 'color: green; font-weight: bold;');
                    break;
                default:
                    console.log(fullMessage);
            }
        },
        
        parseUrlParams: () => {
            const params = new URLSearchParams(window.location.search);
            return {
                only: params.get('only')?.split(',').map(s => s.trim()) || null,
                exclude: params.get('exclude')?.split(',').map(s => s.trim()) || [],
                dev: params.has('dev'),
                verbose: params.has('verbose')
            };
        },
        
        createScriptElement: (url, name) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = false; // Maintain load order
            script.dataset.extensionName = name;
            return script;
        },
        
        loadScript: (url, name, timeout = 30000) => {
            return new Promise((resolve, reject) => {
                const script = Utils.createScriptElement(url, name);
                
                const timeoutId = setTimeout(() => {
                    reject(new Error(`Timeout loading ${name} after ${timeout}ms`));
                }, timeout);
                
                script.onload = () => {
                    clearTimeout(timeoutId);
                    resolve();
                };
                
                script.onerror = () => {
                    clearTimeout(timeoutId);
                    reject(new Error(`Failed to load ${name} from ${url}`));
                };
                
                document.head.appendChild(script);
            });
        }
    };

    // Main loader class
    class ExtensionLoader {
        constructor() {
            this.params = Utils.parseUrlParams();
            this.loadedExtensions = new Set();
            this.failedExtensions = new Set();
            this.startTime = Date.now();
            
            if (this.params.dev || this.params.verbose) {
                Utils.log('Initializing All-in-One Extension Loader');
                Utils.log(`Parameters: ${JSON.stringify(this.params)}`);
            }
        }
        
        getExtensionsToLoad() {
            let extensions = [...CONFIG.EXTENSIONS];
            
            // Filter by 'only' parameter
            if (this.params.only) {
                extensions = extensions.filter(ext => 
                    this.params.only.includes(ext.name)
                );
                Utils.log(`Loading only: ${this.params.only.join(', ')}`);
            }
            
            // Filter by 'exclude' parameter
            if (this.params.exclude.length > 0) {
                extensions = extensions.filter(ext => 
                    !this.params.exclude.includes(ext.name)
                );
                Utils.log(`Excluding: ${this.params.exclude.join(', ')}`);
            }
            
            // Sort by dependencies (dependencies first)
            extensions.sort((a, b) => {
                if (a.category === 'dependency') return -1;
                if (b.category === 'dependency') return 1;
                return 0;
            });
            
            return extensions;
        }
        
        async loadExtension(extension) {
            const url = `${CONFIG.BASE_URL}/${extension.path}`;
            
            try {
                // Check dependencies
                if (extension.dependencies) {
                    for (const dep of extension.dependencies) {
                        if (!this.loadedExtensions.has(dep)) {
                            throw new Error(`Dependency ${dep} not loaded`);
                        }
                    }
                }
                
                if (this.params.verbose) {
                    Utils.log(`Loading ${extension.name}...`);
                }
                
                await Utils.loadScript(url, extension.name);
                this.loadedExtensions.add(extension.name);
                
                if (this.params.verbose) {
                    Utils.log(`✅ ${extension.name} loaded successfully`, 'success');
                }
                
            } catch (error) {
                this.failedExtensions.add(extension.name);
                Utils.log(`❌ Failed to load ${extension.name}: ${error.message}`, 'error');
                throw error;
            }
        }
        
        async loadAll() {
            const extensions = this.getExtensionsToLoad();
            const results = {
                loaded: [],
                failed: [],
                skipped: []
            };
            
            Utils.log(`Starting to load ${extensions.length} extensions/themes...`);
            
            for (const extension of extensions) {
                try {
                    await this.loadExtension(extension);
                    results.loaded.push(extension.name);
                } catch (error) {
                    results.failed.push({
                        name: extension.name,
                        error: error.message
                    });
                    
                    // Continue loading other extensions even if one fails
                    if (this.params.verbose) {
                        Utils.log(`Continuing with remaining extensions...`, 'warn');
                    }
                }
            }
            
            this.reportResults(results);
            return results;
        }
        
        reportResults(results) {
            const totalTime = Date.now() - this.startTime;
            const total = results.loaded.length + results.failed.length;
            
            Utils.log(`\n📊 Loading Summary (${totalTime}ms):`);
            Utils.log(`✅ Loaded: ${results.loaded.length}/${total}`, 'success');
            
            if (results.loaded.length > 0) {
                Utils.log(`   - ${results.loaded.join(', ')}`);
            }
            
            if (results.failed.length > 0) {
                Utils.log(`❌ Failed: ${results.failed.length}`, 'error');
                results.failed.forEach(failure => {
                    Utils.log(`   - ${failure.name}: ${failure.error}`, 'error');
                });
            }
            
            // Expose results for debugging
            if (this.params.dev) {
                window.extensionLoaderResults = results;
                Utils.log('Results available in window.extensionLoaderResults');
            }
        }
    }

    // Initialize and load extensions
    function initializeLoader() {
        try {
            const loader = new ExtensionLoader();
            loader.loadAll().catch(error => {
                Utils.log(`Critical error in extension loader: ${error.message}`, 'error');
            });
        } catch (error) {
            Utils.log(`Critical error in extension loader: ${error.message}`, 'error');
        }
    }

    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLoader);
    } else {
        initializeLoader();
    }

    // Expose loader for debugging
    window.TypingMindExtensionLoader = {
        version: '1.0.0',
        config: CONFIG,
        reload: initializeLoader
    };

})();