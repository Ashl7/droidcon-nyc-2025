import StyleDictionary from 'style-dictionary';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Register Handlebars helpers
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('replace', function(str, find, replace) {
  if (typeof str === 'string') {
    return str.replace(find, replace);
  }
  return str;
});

// Add custom name transform
StyleDictionary.registerTransform({
  name: 'name/compose',
  type: 'name',
  transformer: (prop) => {
    const result = prop.path
      .map((part, index) => {
        if (index === 0) return part.toLowerCase();
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join('');
    console.log(`name/compose transform: ${prop.path.join('.')} → ${result} (type: ${prop.type})`);
    return result;
  }
});

// Add custom transform for Compose dimensions
StyleDictionary.registerTransform({
  name: 'size/dp',
  type: 'value',
  matcher: (prop) => prop.type === 'dimension',
  transformer: (prop) => {
    console.log(`size/dp transform: Processing ${prop.path.join('.')} (value: ${prop.value})`);
    return prop.value;
  }
});

// Add custom format for Compose using template
StyleDictionary.registerFormat({
  name: 'compose/object',
  formatter: function({ dictionary, file, options }) {
    console.log(`\nFormatting ${options.className} with ${dictionary.allProperties.length} properties`);
    
    const templateContent = fs.readFileSync(path.join(__dirname, 'templates/compose-object.hbs'), 'utf8');
    const template = Handlebars.compile(templateContent);
    
    return template({
      packageName: options.packageName,
      className: options.className,
      properties: dictionary.allProperties
    });
  }
});

// Rest of your config...
const myStyleDictionary = StyleDictionary.extend({
  source: ["tokens/**/*.json"],
  platforms: {
    compose: {
      transforms: ['name/compose', 'size/dp'],
      buildPath: "android-app-example/app/src/main/java/com/ashl7/designtokens/ui/theme/",
      files: [
        {
          destination: "StyleDictionaryColor.kt",
          format: "compose/object",
          options: {
            className: "StyleDictionaryColor",
            packageName: "com.ashl7.designtokens.ui.theme"
          },
          filter: {
            type: "color"
          }
        },
        {
          destination: "StyleDictionaryDimension.kt",
          format: "compose/object",
          options: {
            className: "StyleDictionaryDimension",
            packageName: "com.ashl7.designtokens.ui.theme"
          },
          filter: {
            type: "dimension"
          }
        }
      ]
    },
    "ios-swift": {
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

// Build all platforms
myStyleDictionary.buildAllPlatforms();