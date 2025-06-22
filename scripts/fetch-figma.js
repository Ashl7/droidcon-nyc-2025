import fetch from 'node-fetch';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const FIGMA_ACCESS_TOKEN = 'figd_xUqGW9062bT-Qs2WMGzgxiQDzzTsM12xFP5wvh7A';
const FIGMA_FILE_ID = 'moczTcFRkHE8lazAAxTglM';
const COLLECTION_NAME = 'design-tokens';

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
        const collection = data.meta.variableCollections.find(
            collection => collection.name === COLLECTION_NAME
        );

        if (!collection) {
            throw new Error(`Collection "${COLLECTION_NAME}" not found`);
        }

        // Transform variables into our token format
        const tokens = {
            colors: {},
            dimensions: {}
        };

        // Process each variable
        for (const [id, variable] of Object.entries(data.variables)) {
            if (variable.name.startsWith('color/')) {
                // Handle color variables
                const parts = variable.name.split('/');
                const name = `${parts[1]}Mode${parts[2].charAt(0).toUpperCase() + parts[2].slice(1)}`;
                tokens.colors[name] = {
                    $type: "color",
                    $value: variable.valuesByMode[collection.defaultModeId]
                };
            } else if (variable.name.startsWith('size/')) {
                // Handle dimension variables
                const parts = variable.name.split('/');
                const name = parts.slice(1).join('-');
                tokens.dimensions[name] = {
                    $type: "dimension",
                    $value: variable.valuesByMode[collection.defaultModeId].toString()
                };
            }
        }

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
        // const { stdout, stderr } = await execAsync('npm run build');
        // console.log('Style Dictionary Build Output:', stdout);
        // if (stderr) {
        //     console.error('Style Dictionary Build Errors:', stderr);
        // }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the script
fetchFigmaVariables();
