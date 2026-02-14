# Component Library Setup Guide

This is a component library similar to shadcn/ui, where users can install components via a CLI tool.

## Project Structure

```
component-library/
├── packages/
│   ├── cli/                    # CLI tool for installing components
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   └── add.ts     # Main command logic
│   │   │   ├── utils/
│   │   │   │   ├── detect.ts  # Detect TS/JS project
│   │   │   │   └── fetch.ts   # Fetch files from registry
│   │   │   └── index.ts       # CLI entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   │
│   └── registry/              # Component files (to be hosted)
│       ├── registry.json      # Component metadata
│       └── components/
│           └── button/
│               ├── button.tsx # TypeScript version
│               └── button.jsx # JavaScript version
│
├── package.json               # Root workspace config
├── pnpm-workspace.yaml
└── tsconfig.json              # Base TypeScript config
```

## Setup Steps

### 1. Install Dependencies

```bash
# Install all dependencies
pnpm install
```

### 2. Build the CLI

```bash
cd packages/cli
pnpm build
```

### 3. Test Locally

```bash
# Link the CLI globally for testing
pnpm link --global

# Now you can use it anywhere
subhadip-ui add button
```

### 4. Deploy the Registry

You need to host the `packages/registry` folder somewhere accessible via HTTP. Options:

#### Option A: GitHub Pages (Free)
1. Push your code to GitHub
2. Enable GitHub Pages for your repository
3. The registry will be available at: `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/packages/registry`

#### Option B: Vercel/Netlify (Free)
1. Create a simple static site that serves the registry folder
2. Deploy to Vercel or Netlify
3. Update the `BASE_URL` in `packages/cli/src/commands/add.ts`

#### Option C: Custom Domain
1. Host the registry folder on your own server
2. Set the `REGISTRY_URL` environment variable when using the CLI

### 5. Update the Registry URL

Edit `packages/cli/src/commands/add.ts` and update line 9:

```typescript
const BASE_URL = process.env.REGISTRY_URL || "https://YOUR_ACTUAL_URL/packages/registry"
```

Replace `YOUR_ACTUAL_URL` with your deployed registry URL.

### 6. Publish to npm

```bash
cd packages/cli
npm login
npm publish
```

## Adding New Components

1. Create the component files:
   ```bash
   mkdir packages/registry/components/your-component
   # Create both .tsx and .jsx versions
   ```

2. Update `packages/registry/registry.json`:
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

3. Commit and push to update the registry

## Usage for End Users

Once published, users can install components like this:

```bash
# Install the CLI
npm install -g subhadip-ui

# Add components to their project
subhadip-ui add button
subhadip-ui add card
```

## Environment Variables

- `REGISTRY_URL`: Override the default registry URL
  ```bash
  REGISTRY_URL=https://custom-url.com/registry subhadip-ui add button
  ```

## Troubleshooting

### "Cannot find module 'react'"
- Make sure React dependencies are installed in the root workspace
- Run: `pnpm add -w -D react react-dom @types/react @types/react-dom`

### "Registry not found"
- Check that your registry is properly deployed and accessible
- Verify the `BASE_URL` is correct
- Test the URL manually: `curl https://your-url/registry.json`

### CLI not found after linking
- Make sure you ran `pnpm build` before `pnpm link --global`
- Check that the `bin` field in `package.json` points to the correct file

## Next Steps

1. ✅ Fix the registry URL in `add.ts`
2. ✅ Add more components to the registry
3. ✅ Deploy the registry to a hosting service
4. ✅ Test the CLI with a real project
5. ✅ Publish to npm
