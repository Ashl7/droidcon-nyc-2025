import StyleDictionary from 'style-dictionary';

// Add custom name transform
StyleDictionary.registerTransform({
  name: 'name/compose',
  type: 'name',
  transformer: (prop) => {
    // Convert the property path to proper camelCase
    return prop.path
      .map((part, index) => {
        // If it's the first part, keep it lowercase
        if (index === 0) {
          return part.toLowerCase();
        }
        // Otherwise capitalize the first letter
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join('');
  }
});

// Add custom transform for Compose dimensions
StyleDictionary.registerTransform({
  name: 'size/dp',
  type: 'value',
  matcher: (prop) => prop.type === 'dimension',
  transformer: (prop) => prop.value // Just return the raw number
});

// Add custom format for Compose
StyleDictionary.registerFormat({
  name: 'compose/object',
  formatter: function({ dictionary, file, options }) {
    const className = options.className || 'StyleDictionary';
    return `package ${options.packageName}

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

object ${className} {
${dictionary.allProperties.map(prop => {
  if (prop.type === 'color') {
    // Convert hex to Color constructor
    const hex = prop.value.replace('#', '0xFF');
    return `    val ${prop.name} = Color(${hex})`
  } else if (prop.type === 'dimension') {
    return `    val ${prop.name} = ${prop.value}.dp`
  }
  return '';
}).filter(Boolean).join('\n')}
}
`
  }
});

// Create style dictionary config
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