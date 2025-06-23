# Droidcon NYC 2025 - Design Tokens Demo

This project demonstrates a complete design token workflow using Style Dictionary to generate cross-platform design tokens. It includes:
- Figma integration for token source management
- Token generation for Android (Jetpack Compose) and macOS platforms
- Example apps showcasing token usage

## Project Structure

```
.
├── tokens/                     # Design token source files
│   ├── colors.json            # Color tokens
│   └── dimensions.json        # Dimension tokens
├── scripts/
│   └── fetch-figma.js        # Script to fetch tokens from Figma
├── android-app-example/       # Android demo app using Compose
└── mac-os-app-example/       # macOS demo app
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Figma access token:
   ```
   FIGMA_ACCESS_TOKEN=your_token_here
   ```

## Available Commands

- `npm run fetch-tokens`: Fetches design tokens from Figma and converts them to Style Dictionary format
- `npm run build`: Generates platform-specific token files
- `npm run update-tokens`: Runs both fetch and build commands

## Token Structure

### Colors
Colors are organized by semantic purpose with light/dark variants:
```json
{
  "color": {
    "primary": {
      "light": { "value": "#E04C1F", "type": "color" },
      "dark": { "value": "#0057CC", "type": "color" }
    }
  }
}
```

### Dimensions
Dimensions are organized by category and size:
```json
{
  "dimension": {
    "radius": {
      "8": { "value": "8", "type": "dimension" }
    },
    "icon": {
      "small": { "value": "32", "type": "dimension" }
    }
  }
}
```

## Generated Code

### Android (Compose)
```kotlin
object StyleDictionaryColor {
    val colorPrimaryLight = Color(0xFFE04C1F)
    val colorPrimaryDark = Color(0xFF0057CC)
}

object StyleDictionaryDimension {
    val dimensionRadius8 = 8.dp
    val dimensionIconSmall = 32.dp
}
```

### macOS (Swift)
```swift
public class StyleDictionaryColor {
    public static let colorPrimaryLight = NSColor(red: 0.878, green: 0.298, blue: 0.122, alpha: 1)
    public static let colorPrimaryDark = NSColor(red: 0.000, green: 0.341, blue: 0.800, alpha: 1)
}
```

## Figma Setup

1. Create a collection named "design-tokens"
2. Create variables following the naming convention:
   - Colors: "color/primary/light"
   - Dimensions: "dimension/radius/8"
3. Add your Figma access token to .env file

## Development Workflow

1. Make changes to variables in Figma
2. Run `npm run fetch-tokens` to update local token files
3. Run `npm run build` to generate platform-specific code
4. Or use `npm run update-tokens` to do both

## Contributing

Feel free to submit issues and enhancement requests!
