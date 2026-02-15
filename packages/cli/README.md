# Froniq UI CLI

A CLI tool to add components from your component library to any project.

## Installation

```bash
npm install -g froniq-ui
# or
pnpm add -g froniq-ui
```

## Usage

```bash
# Add a component to your project
froniq-ui add button

# Add a card component
froniq-ui add card
```

## Configuration

By default, the CLI fetches components from the GitHub repository. You can override this by setting the `REGISTRY_URL` environment variable:

```bash
# Use a custom registry URL
REGISTRY_URL=https://your-domain.com/registry froniq-ui add button
```

## How It Works

1. The CLI detects whether your project uses TypeScript or JavaScript
2. It fetches the component from the registry
3. It downloads the appropriate file (`.tsx` for TypeScript, `.jsx` for JavaScript)
4. It saves the component to `components/ui/` in your project

## Development

```bash
# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Test locally (link the package)
pnpm link --global
```

## Registry Setup

The CLI expects a registry hosted at a URL with the following structure:

```
registry/
├── registry.json
└── components/
    ├── button/
    │   ├── button.tsx
    │   └── button.jsx
    └── card/
        ├── card.tsx
        └── card.jsx
```

The `registry.json` file should have this format:

```json
{
  "button": {
    "files": [
      {
        "path": "components/button/button.tsx"
      }
    ]
  },
  "card": {
    "files": [
      {
        "path": "components/card/card.tsx"
      }
    ]
  }
}
```

## Publishing

1. Update the `BASE_URL` in `src/commands/add.ts` to point to your deployed registry
2. Build the package: `pnpm build`
3. Publish to npm: `npm publish`
