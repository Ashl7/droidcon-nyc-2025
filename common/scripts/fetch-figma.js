import fetch from 'node-fetch';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import 'dotenv/config';

const execAsync = promisify(exec);

// Configuration - Load from environment variables for security
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_ID = 'moczTcFRkHE8lazAAxTglM';
const COLLECTION_NAME = 'droidcon';

// Validate environment setup
if (!FIGMA_ACCESS_TOKEN) {
    console.error('Error: FIGMA_ACCESS_TOKEN not found in .env file');
    process.exit(1);
}

/**
 * Helper function to create nested objects from path array
 * @param {Object} obj - The object to modify
 * @param {Array} path - Array of path segments
 * @param {*} value - The value to set
 */
function setNestedValue(obj, path, value) {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
            current[path[i]] = {};
        }
        current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
}

/**
 * Main function to fetch variables from Figma and generate token files
 * Process:
 * 1. Fetch variables from Figma API
 * 2. Find our specific collection
 * 3. Transform Figma variables into our token format
 * 4. Save to token files
 * 5. Run Style Dictionary build
 */
async function fetchFigmaVariables() {
    try {
        console.log('🚀 Starting Figma design token fetch...');
        
        // 1. Fetch from Figma API
        console.log('📡 Fetching variables from Figma...');
        const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_ID}/variables/local`, {
            headers: {
                'X-Figma-Token': FIGMA_ACCESS_TOKEN
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // 2. Find our collection
        console.log(`🔍 Looking for collection: ${COLLECTION_NAME}`);
        const collections = Object.values(data.meta.variableCollections);
        const collection = collections.find(c => c.name === COLLECTION_NAME);

        if (!collection) {
            throw new Error(`Collection "${COLLECTION_NAME}" not found`);
        }

        // 3. Transform variables into our token format
        console.log('🔄 Converting variables to json...');
        const tokens = {
            dimension: {},
            color: {}
        };

        // Track counts for logging
        let colorCount = 0;
        let dimensionCount = 0;

        // Convert each variable to json
        Object.values(data.meta.variables).forEach(variable => {
            if (variable.variableCollectionId === collection.id) {
                const value = variable.valuesByMode[collection.defaultModeId];
                
                if (variable.name.startsWith('color/')) {
                    // Handle color variables
                    const parts = variable.name.split('/');
                    // Remove 'color' prefix and create nested structure
                    const path = parts.slice(1);
                    const hex = rgbaToHex(value.r, value.g, value.b);
                    setNestedValue(tokens.color, path, {
                        value: hex.toUpperCase(),
                        type: "color"
                    });
                    colorCount++;
                } else if (variable.name.startsWith('dimension/')) {
                    // Handle dimension variables
                    const parts = variable.name.split('/');
                    // Remove 'dimension' from parts and create nested structure
                    const path = parts.slice(1);
                    setNestedValue(tokens.dimension, path, {
                        value: value.toString(),
                        type: "dimension"
                    });
                    dimensionCount++;
                }
            }
        });

        console.log(`\n📊 Summary:`);
        console.log(`   Colors converted: ${colorCount}`);
        console.log(`   Dimensions converted: ${dimensionCount}`);

        // 4. Save to token files
        console.log('\n💾 Saving token files...');
        await fs.writeFile(
            './tokens/colors.json',
            JSON.stringify({ color: tokens.color }, null, 2)
        );
        console.log('   ✅ Saved colors.json');
        
        await fs.writeFile(
            './tokens/dimensions.json',
            JSON.stringify({ dimension: tokens.dimension }, null, 2)
        );
        console.log('   ✅ Saved dimensions.json');
    } catch (error) {
        console.error('\n❌ Error:', error);
        // Log more details for specific errors
        if (error.message.includes('401')) {
            console.error('   This usually means your Figma access token is invalid or expired.');
        }
        if (error.message.includes('404')) {
            console.error('   This usually means the Figma file ID is incorrect or you don\'t have access to it.');
        }
    }
}

/**
 * Helper function to convert RGBA values from Figma to hex color codes
 * @param {number} r - Red value (0-1)
 * @param {number} g - Green value (0-1)
 * @param {number} b - Blue value (0-1)
 * @returns {string} Hex color code (e.g., "#FF0000")
 */
function rgbaToHex(r, g, b) {
    const toHex = (value) => {
        const hex = Math.round(value * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

// Run the script
fetchFigmaVariables();
