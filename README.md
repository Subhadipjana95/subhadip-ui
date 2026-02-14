# Subhadip UI

A modern, lightweight component library for React applications. Install only the components you need, directly into your project.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/subhadip-ui.svg)](https://www.npmjs.com/package/subhadip-ui)

## 🎯 Philosophy

Unlike traditional component libraries that bloat your `node_modules`, Subhadip UI follows the **shadcn/ui** approach:

- ✅ **Copy, don't install** - Components are copied directly into your project
- ✅ **Full ownership** - Modify components to fit your exact needs
- ✅ **No dependencies** - Only install what you use
- ✅ **TypeScript & JavaScript** - Works with both TS and JS projects
- ✅ **Framework agnostic** - Pure React components

## 🚀 Quick Start

### Installation

Install the CLI tool globally or use it with `npx`:

```bash
# Install globally
npm install -g subhadip-ui

# Or use with npx (no installation required)
npx subhadip-ui@latest add button
```

### Usage

Add components to your project with a single command:

```bash
# Add a button component
subhadip-ui add button

# Add multiple components
subhadip-ui add card
subhadip-ui add input
```

The CLI will:
1. Detect if your project uses TypeScript or JavaScript
2. Download the appropriate component files
3. Place them in your `src/components` directory
4. You're ready to use them!

## 📦 Available Components

| Component | Description                   | Status        |
| --------- | ----------------------------- | ------------- |
| `button`  | Customizable button component | ✅ Available   |
| `card`    | Coming soon                   | 🚧 In Progress |
| `input`   | Coming soon                   | 📋 Planned     |

> More components are being added regularly. Check back soon!

## 💡 Example

After adding a component:

```tsx
// TypeScript
import { Button } from './components/button/button'

export default function App() {
  return (
    <Button onClick={() => alert('Hello!')}>
      Click me
    </Button>
  )
}
```

```jsx
// JavaScript
import { Button } from './components/button/button'

export default function App() {
  return (
    <Button onClick={() => alert('Hello!')}>
      Click me
    </Button>
  )
}
```

## 🏗️ Project Structure

This is a monorepo managed with **pnpm workspaces** and **Turborepo**:

```
component-library/
├── packages/
│   ├── cli/                    # CLI tool for installing components
│   │   ├── src/
│   │   │   ├── commands/       # Command implementations
│   │   │   ├── utils/          # Utility functions
│   │   │   └── index.ts        # CLI entry point
│   │   └── package.json
│   │
│   └── registry/               # Component registry (hosted remotely)
│       ├── registry.json       # Component metadata
│       └── components/         # Component source files
│           └── button/
│               ├── button.tsx  # TypeScript version
│               └── button.jsx  # JavaScript version
│
├── package.json                # Root workspace config
├── pnpm-workspace.yaml
└── turbo.json
```

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/Subhadipjana95/subhadip-ui.git
cd subhadip-ui

# Install dependencies
pnpm install

# Build the CLI
cd packages/cli
pnpm build

# Link for local testing
pnpm link --global

# Test the CLI
subhadip-ui add button
```

### Adding New Components

1. **Create component files** in `packages/registry/components/`:

```bash
mkdir packages/registry/components/your-component
# Create both .tsx and .jsx versions
```

2. **Update the registry** in `packages/registry/registry.json`:

```json
{
  "your-component": {
    "files": [
      {
        "path": "components/your-component/your-component.tsx"
      }
    ]
  }
}
```

3. **Test locally**:

```bash
subhadip-ui add your-component
```

4. **Commit and deploy** the registry

### Building

```bash
# Build all packages
pnpm build

# Build specific package
cd packages/cli
pnpm build

# Watch mode for development
pnpm dev
```

## 🌐 Deployment

### Registry Hosting

The component registry needs to be hosted and accessible via HTTP. Options:

#### GitHub Raw (Recommended for Open Source)

```typescript
// packages/cli/src/commands/add.ts
const BASE_URL = "https://raw.githubusercontent.com/Subhadipjana95/subhadip-ui/main/packages/registry"
```

#### Vercel/Netlify

Deploy the registry as a static site and update the `BASE_URL` accordingly.

#### Custom Domain

Set the `REGISTRY_URL` environment variable:

```bash
REGISTRY_URL=https://subhadip-ui.com/registry subhadip-ui add button
```

### Publishing to npm

```bash
cd packages/cli
npm login
npm publish
```

## 🔧 Configuration

### Environment Variables

- `REGISTRY_URL` - Override the default registry URL

```bash
REGISTRY_URL=https://subhadip-ui.com/registry subhadip-ui add button
```

## 📝 How It Works

1. **CLI Detection** - The CLI detects whether your project uses TypeScript or JavaScript by checking for `tsconfig.json`
2. **Registry Fetch** - It fetches the component metadata from the hosted registry
3. **File Download** - Downloads the appropriate component files (.tsx or .jsx)
4. **Local Installation** - Copies files to your `src/components` directory
5. **Ready to Use** - You can now import and customize the components

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-component`)
3. Commit your changes (`git commit -m 'Add amazing component'`)
4. Push to the branch (`git push origin feature/amazing-component`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Provide both TypeScript and JavaScript versions
- Add components to the registry
- Update documentation
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [shadcn/ui](https://ui.shadcn.com/)
- Built with [Commander.js](https://github.com/tj/commander.js)
- Powered by [Turborepo](https://turbo.build/)

## 📧 Contact

**Subhadip Jana**

- GitHub: [@Subhadipjana95](https://github.com/Subhadipjana95)
- Email: [codesubhadip95@gmail.com]

---

<p align="center">Made with 💚 by Subhadip Jana</p>
