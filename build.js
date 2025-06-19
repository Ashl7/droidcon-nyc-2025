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
 * Transform: size/dp
 * Purpose: Prepares dimension values for Compose's dp format
 * Applies to: Only tokens with type "dimension" (controlled by matcher)
 * Example:
 * - Input: "8"
 * - Output: "8" (template will add .dp later)
 */
StyleDictionary.registerTransform({
  name: 'size/dp',
  type: 'value',  // Affects the property values
  matcher: (prop) => prop.type === 'dimension',  // Only runs on dimensions
  transformer: (prop) => prop.value
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
    const templateContent = fs.readFileSync(path.join(__dirname, 'templates/compose-object.hbs'), 'utf8');
    const template = Handlebars.compile(templateContent);
    
    return template({
      packageName: options.packageName,
      className: options.className,
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
      transforms: ['name/compose', 'size/dp'],
      // Output directory for generated files
      buildPath: "android-app-example/app/src/main/java/com/ashl7/designtokens/ui/theme/",
      // File configurations
      files: [
        {
          // Colors file configuration
          destination: "StyleDictionaryColor.kt",
          format: "compose/object",
          options: {
            className: "StyleDictionaryColor",
            packageName: "com.ashl7.designtokens.ui.theme"
          },
          // Filter to only include color tokens
          filter: {
            type: "color"
          }
        },
        {
          // Dimensions file configuration
          destination: "StyleDictionaryDimension.kt",
          format: "compose/object",
          options: {
            className: "StyleDictionaryDimension",
            packageName: "com.ashl7.designtokens.ui.theme"
          },
          // Filter to only include dimension tokens
          filter: {
            type: "dimension"
          }
        }
      ]
    },
    // iOS platform configuration
    "ios-swift": {
      // Using built-in iOS transforms
      transformGroup: "ios-swift",
      buildPath: "mac-os-app-example/mac-os-app-example/generated-tokens/",
      files: [
        {
          destination: "StyleDictionaryColor.swift",
          format: "ios-swift/class.swift",
          className: "StyleDictionaryColor",
          filter: {
            type: "color"
          }
        },
        {
          destination: "StyleDictionaryDimension.swift",
          format: "ios-swift/class.swift",
          className: "StyleDictionaryDimension",
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