import fetch from 'node-fetch';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import 'dotenv/config';

const execAsync = promisify(exec);

// Configuration
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_ID = 'moczTcFRkHE8lazAAxTglM';
const COLLECTION_NAME = 'design-tokens';

if (!FIGMA_ACCESS_TOKEN) {
    console.error('Error: FIGMA_ACCESS_TOKEN not found in .env file');
    process.exit(1);
}

async function fetchFigmaVariables() {
    try {
        // Fetch variables metadata
        const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_ID}/variables/local`, {
            headers: {
                'X-Figma-Token': FIGMA_ACCESS_TOKEN
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Find our collection
        const collections = Object.values(data.meta.variableCollections);
        const collection = collections.find(c => c.name === COLLECTION_NAME);

        if (!collection) {
            throw new Error(`Collection "${COLLECTION_NAME}" not found`);
        }

        // Transform variables into our token format
        const tokens = {
            colors: {},
            dimensions: {}
        };

        // Process each variable
        Object.values(data.meta.variables).forEach(variable => {
            if (variable.variableCollectionId === collection.id) {
                const value = variable.valuesByMode[collection.defaultModeId];
                
                if (variable.name.startsWith('color/')) {
                    // Handle color variables
                    const parts = variable.name.split('/');
                    const name = `${parts[1]}Mode${parts[2].charAt(0).toUpperCase() + parts[2].slice(1)}`;
                    // Convert RGBA to hex
                    const hex = rgbaToHex(value.r, value.g, value.b);
                    tokens.colors[name] = {
                        $type: "color",
                        $value: hex
                    };
                } else if (variable.name.startsWith('dimension/')) {
                    // Handle dimension variables
                    const parts = variable.name.split('/');
                    const name = parts.slice(1).join('-');
                    tokens.dimensions[name] = {
                        $type: "dimension",
                        $value: value.toString()
                    };
                }
            }
        });

        // Save to token files
        await fs.writeFile(
            './tokens/colors.json',
            JSON.stringify({ colors: tokens.colors }, null, 2)
        );
        
        await fs.writeFile(
            './tokens/dimensions.json',
            JSON.stringify({ dimensions: tokens.dimensions }, null, 2)
        );

        console.log('Successfully fetched and saved tokens from Figma');

        // Run style dictionary build
        const { stdout, stderr } = await execAsync('node build.js');
        console.log('Style Dictionary Build Output:', stdout);
        if (stderr) {
            console.error('Style Dictionary Build Errors:', stderr);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Helper function to convert RGBA to hex
function rgbaToHex(r, g, b) {
    const toHex = (value) => {
        const hex = Math.round(value * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

// Run the script
fetchFigmaVariables();
