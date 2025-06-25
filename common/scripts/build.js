import StyleDictionary from 'style-dictionary';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Register Handlebars helpers for the template
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('replace', function(str, find, replace) {
  if (typeof str === 'string') {
    return str.replace(find, replace);
  }
  return str;
});

/**
 * Helper function to convert hex to RGB values
 */
function parseColor(color) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

// Register color helper functions for the macOS template
Handlebars.registerHelper('colorRed', function(hex) {
  const { r } = parseColor(hex);
  return (r/255).toFixed(3);
});

Handlebars.registerHelper('colorGreen', function(hex) {
  const { g } = parseColor(hex);
  return (g/255).toFixed(3);
});

Handlebars.registerHelper('colorBlue', function(hex) {
  const { b } = parseColor(hex);
  return (b/255).toFixed(3);
});

/**
 * Transform: name/compose
 * Purpose: Converts token names into camelCase format suitable for Kotlin
 * Applies to: ALL tokens (no matcher specified)
 * Example: 
 * - Input: primary-mode-light
 * - Output: colorPrimaryModeLight
 */
StyleDictionary.registerTransform({
  name: 'name/compose',
  type: 'name',  // Affects the property names
  transformer: (prop) => {
    return prop.path
      .map((part, index) => {
        // First part (e.g., 'color', 'size') stays lowercase
        if (index === 0) return part.toLowerCase();
        // Other parts get capitalized (e.g., 'Primary', 'Mode', 'Light')
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join('');
  }
});

/**
 * Transform: size
 * Purpose: Prepares dimension values for Compose's dp format
 * Applies to: Only tokens with type "dimension" (controlled by matcher)
 * Example:
 * - Input: "8"
 * - Output: "8" (template will add .dp later)
 */
StyleDictionary.registerTransform({
  name: 'size',
  type: 'value',  // Affects the property values
  matcher: (prop) => prop.type === 'dimension',  // Only runs on dimensions
  transformer: (prop) => prop.value
});

/**
 * Transform: color/hex
 * Purpose: Ensures color values are in correct hex format
 */
StyleDictionary.registerTransform({
  name: 'color/hex',
  type: 'value',
  matcher: (prop) => prop.type === 'color',
  transformer: (prop) => {
    // Ensure the color value starts with #
    return prop.value.startsWith('#') ? prop.value : `#${prop.value}`;
  }
});

/**
 * Format: compose/object
 * Purpose: Generates Kotlin files using Handlebars template
 * Input: Transformed tokens filtered by type
 * Output: Kotlin object with Color or dimension properties
 */
StyleDictionary.registerFormat({
  name: 'compose/object',
  formatter: function({ dictionary, file, options }) {
    const templateContent = fs.readFileSync(path.join(__dirname, '../templates/compose-object.hbs'), 'utf8');
    const template = Handlebars.compile(templateContent);
    
    return template({
      packageName: options.packageName,
      className: options.className,
      properties: dictionary.allProperties
    });
  }
});

/**
 * Format: macos/class
 * Purpose: Generates Swift files for macOS without timestamp
 */
StyleDictionary.registerFormat({
  name: 'macos/class',
  formatter: function({ dictionary, file }) {
    const templateContent = fs.readFileSync(path.join(__dirname, '../templates/macos-class.hbs'), 'utf8');
    const template = Handlebars.compile(templateContent);
    
    return template({
      className: file.className,
      properties: dictionary.allProperties
    });
  }
});

/**
 * Style Dictionary Configuration
 * 
 * The build process follows these steps:
 * 1. Load tokens from JSON files in the tokens directory
 * 2. Apply transforms in the specified order to ALL tokens
 * 3. For each file configuration:
 *    a. Filter tokens by type (color or dimension)
 *    b. Apply the format to generate the output file
 *    c. Save to the specified destination
 */
const myStyleDictionary = StyleDictionary.extend({
  // Source glob pattern to find all token files
  source: ["tokens/**/*.json"],
  
  // Platform configurations
  platforms: {
    // Compose (Android) platform
    compose: {
      // Transforms to apply (order matters!)
      transforms: ['name/compose', 'size', 'color/hex'],
      // Output directory for generated files
      buildPath: "../android-app-example/app/src/main/java/com/ashl7/designtokens/ui/theme/",
      // File configurations
      files: [
        {
          // Colors file configuration
          destination: "DroidconColors.kt",
          format: "compose/object",
          options: {
            className: "DroidconColors",
            packageName: "com.ashl7.designtokens.ui.theme"
          },
          // Filter to only include color tokens
          filter: {
            type: "color"
          }
        },
        {
          // Dimensions file configuration
          destination: "DroidconDimensions.kt",
          format: "compose/object",
          options: {
            className: "DroidconDimensions",
            packageName: "com.ashl7.designtokens.ui.theme"
          },
          // Filter to only include dimension tokens
          filter: {
            type: "dimension"
          }
        }
      ]
    },
    
    // macOS platform configuration
    "macos": {
      transforms: ['name/compose', 'size', 'color/hex'],
      buildPath: "../mac-os-app-example/mac-os-app-example/generated-tokens/",
      files: [
        {
          destination: "DroidconColors.swift",
          format: "macos/class",
          className: "DroidconColors",
          filter: {
            type: "color"
          }
        },
        {
          destination: "DroidconDimensions.swift",
          format: "macos/class",
          className: "DroidconDimensions",
          filter: {
            type: "dimension"
          }
        }
      ]
    }
  }
});

// Execute the build for all platforms
myStyleDictionary.buildAllPlatforms();