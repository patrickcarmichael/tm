#!/usr/bin/env node

/**
 * TypingMind Extension Header Generator
 * 
 * Generates standardized JSDoc headers for TypingMind extensions and themes
 * according to the CLAUDE.md specifications.
 * 
 * @author Claude
 * @version 1.0.0
 * @created 2025-01-03
 * @updated 2025-01-03
 * @category tool
 * @requires Node.js
 * @compatibility Node.js 14+
 * 
 * Usage:
 * - Interactive: node header-generator.js
 * - CLI: node header-generator.js --name "Extension Name" --category extension
 * 
 * @license MIT
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    TEMPLATE_VERSION: '1.0.0',
    SUPPORTED_CATEGORIES: ['extension', 'theme', 'tool'],
    DEFAULT_AUTHOR: 'Unknown',
    DEFAULT_LICENSE: 'MIT',
    DEFAULT_REPOSITORY: 'https://github.com/patrick/tm',
    CURRENT_DATE: new Date().toISOString().split('T')[0]
};

// Template generator class
class HeaderGenerator {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // Generate the standardized header
    generateHeader(options) {
        const {
            name,
            description,
            author = CONFIG.DEFAULT_AUTHOR,
            version = '1.0.0',
            created = CONFIG.CURRENT_DATE,
            updated = CONFIG.CURRENT_DATE,
            category = 'extension',
            requires = 'None',
            compatibility = 'TypingMind Web, macOS, Mobile PWA',
            features = [],
            installation = [
                '1. Go to TypingMind → Preferences → Advanced Settings → Extensions',
                '2. Add extension URL or paste code directly',
                '3. Restart TypingMind for changes to take effect'
            ],
            usage = 'See documentation below',
            configuration = 'No configuration required',
            storage = 'No data stored',
            license = CONFIG.DEFAULT_LICENSE,
            repository = CONFIG.DEFAULT_REPOSITORY,
            source = 'Original implementation'
        } = options;

        const formattedFeatures = features.length > 0 
            ? features.map(f => ` * - ${f}`).join('\n')
            : ' * - Basic functionality';

        const formattedInstallation = installation
            .map((step, i) => ` * ${i + 1}. ${step}`)
            .join('\n');

        return `/**
 * ${name} for TypingMind
 * 
 * ${description}
 * 
 * @author ${author}
 * @version ${version}
 * @created ${created}
 * @updated ${updated}
 * @category ${category}
 * @requires ${requires}
 * @compatibility ${compatibility}
 * 
 * Features:
${formattedFeatures}
 * 
 * Installation:
${formattedInstallation}
 * 
 * Usage:
 * ${usage}
 * 
 * Configuration:
 * ${configuration}
 * 
 * Storage:
 * ${storage}
 * 
 * @license ${license}
 * @repository ${repository}
 * @source ${source}
 * 
 * Security Note: This extension has access to all TypingMind data and functionality.
 * Review code carefully before installation.
 */`;
    }

    // Generate basic code structure template
    generateCodeTemplate(category, name) {
        const safeName = name.replace(/[^a-zA-Z0-9]/g, '');
        
        if (category === 'theme') {
            return `\n(function () {\n    'use strict';\n\n    // Configuration constants\n    const CONFIG = {\n        colors: {\n            primary: '#000000',\n            secondary: '#ffffff'\n        },\n        selectors: {\n            // Add your selectors here\n        }\n    };\n\n    // Utility functions\n    const Utils = {\n        log: (message) => console.log(\`[${safeName}] \${message}\`),\n        \n        safe: (fn, context = 'unknown') => {\n            try {\n                return fn();\n            } catch (e) {\n                console.error(\`[${safeName}] Error in \${context}:\`, e);\n                return null;\n            }\n        }\n    };\n\n    // Main theme functionality\n    function initTheme() {\n        Utils.safe(() => {\n            // Add your theme logic here\n            Utils.log('Theme initialized');\n        }, 'initTheme');\n    }\n\n    // Initialize\n    if (document.readyState === 'loading') {\n        document.addEventListener('DOMContentLoaded', initTheme);\n    } else {\n        initTheme();\n    }\n})();`;
        } else {
            return `\n(() => {\n    'use strict';\n\n    // Configuration constants\n    const CONFIG = {\n        STORAGE_KEY: '${safeName.toLowerCase()}_settings',\n        SELECTORS: {\n            // Add your selectors here\n        }\n    };\n\n    // Utility functions\n    const Utils = {\n        log: (message) => console.log(\`[${safeName}] \${message}\`),\n        \n        safe: (fn, context = 'unknown') => {\n            try {\n                return fn();\n            } catch (e) {\n                console.error(\`[${safeName}] Error in \${context}:\`, e);\n                return null;\n            }\n        }\n    };\n\n    // Main extension functionality\n    function initExtension() {\n        Utils.safe(() => {\n            // Add your extension logic here\n            Utils.log('Extension initialized');\n        }, 'initExtension');\n    }\n\n    // Initialize\n    if (document.readyState === 'loading') {\n        document.addEventListener('DOMContentLoaded', initExtension);\n    } else {\n        initExtension();\n    }\n})();`;
        }
    }

    // Interactive prompt for user input
    async prompt(question, defaultValue = '') {
        return new Promise((resolve) => {
            const displayDefault = defaultValue ? ` (${defaultValue})` : '';
            this.rl.question(`${question}${displayDefault}: `, (answer) => {
                resolve(answer.trim() || defaultValue);
            });
        });
    }

    // Parse command line arguments
    parseArgs() {
        const args = process.argv.slice(2);
        const options = {};
        
        for (let i = 0; i < args.length; i += 2) {
            const key = args[i]?.replace(/^--/, '');
            const value = args[i + 1];
            if (key && value) {
                options[key] = value;
            }
        }
        
        return options;
    }

    // Interactive mode
    async runInteractive() {
        console.log('\n🎯 TypingMind Extension Header Generator\n');
        console.log('This tool will generate a standardized header for your TypingMind extension or theme.\n');

        const name = await this.prompt('Extension/Theme name');
        if (!name) {
            console.log('❌ Name is required');
            return;
        }

        const description = await this.prompt('Brief description');
        const author = await this.prompt('Author name', CONFIG.DEFAULT_AUTHOR);
        const version = await this.prompt('Version', '1.0.0');
        const category = await this.prompt(`Category (${CONFIG.SUPPORTED_CATEGORIES.join('/')})`, 'extension');
        
        if (!CONFIG.SUPPORTED_CATEGORIES.includes(category)) {
            console.log(`❌ Invalid category. Must be one of: ${CONFIG.SUPPORTED_CATEGORIES.join(', ')}`);
            return;
        }

        const requires = await this.prompt('Dependencies (comma-separated)', 'None');
        const includeTemplate = await this.prompt('Include code template? (y/n)', 'y');

        // Build features array
        const features = [];
        console.log('\nEnter features (one per line, empty line to finish):');
        while (true) {
            const feature = await this.prompt('Feature');
            if (!feature) break;
            features.push(feature);
        }

        const options = {
            name,
            description: description || `${name} functionality for TypingMind`,
            author,
            version,
            category,
            requires,
            features: features.length > 0 ? features : [`${name} functionality`]
        };

        // Generate header
        const header = this.generateHeader(options);
        console.log('\n📋 Generated Header:\n');
        console.log(header);

        if (includeTemplate.toLowerCase() === 'y') {
            const codeTemplate = this.generateCodeTemplate(category, name);
            console.log('\n🔧 Code Template:\n');
            console.log(codeTemplate);
            
            // Offer to save to file
            const saveToFile = await this.prompt('\nSave to file? (y/n)', 'n');
            if (saveToFile.toLowerCase() === 'y') {
                const filename = await this.prompt('Filename', `${name.toLowerCase().replace(/\s+/g, '-')}.js`);
                const fullContent = header + codeTemplate;
                
                try {
                    fs.writeFileSync(filename, fullContent);
                    console.log(`✅ File saved as ${filename}`);
                } catch (error) {
                    console.log(`❌ Error saving file: ${error.message}`);
                }
            }
        }
    }

    // CLI mode
    async runCLI(args) {
        const { name, description, category = 'extension', author = CONFIG.DEFAULT_AUTHOR } = args;
        
        if (!name) {
            console.log('❌ --name is required in CLI mode');
            console.log('Usage: node header-generator.js --name "Extension Name" --description "Description" --category extension');
            return;
        }

        const options = {
            name,
            description: description || `${name} functionality for TypingMind`,
            author,
            category,
            features: [`${name} functionality`]
        };

        const header = this.generateHeader(options);
        console.log(header);
    }

    // Main entry point
    async run() {
        const args = this.parseArgs();
        
        try {
            if (Object.keys(args).length > 0) {
                await this.runCLI(args);
            } else {
                await this.runInteractive();
            }
        } catch (error) {
            console.error('❌ Error:', error.message);
        } finally {
            this.rl.close();
        }
    }

    // Cleanup
    close() {
        this.rl.close();
    }
}

// Run if called directly
if (require.main === module) {
    const generator = new HeaderGenerator();
    generator.run().catch(console.error);
}

module.exports = HeaderGenerator;