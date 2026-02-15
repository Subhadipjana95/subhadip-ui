# Froniq UI Registry

This directory contains the component definitions compatible with `shadcn-ui`.

## Installation Methods

### 1. Using ShadCN CLI (Direct URL)

You can install components directly using the standard `shadcn` CLI by pointing to the raw JSON file:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/Subhadipjana95/subhadip-ui/main/packages/registry/public/r/button.json
```

### 2. Configure a Custom Registry (Recommended)

To use the `@froniq/component` syntax (like Aceternity UI), configure your project's `components.json`:

1.  Edit `components.json` in your project root.
2.  Add the `registries` field:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": { ... },
  "aliases": { ... },
  "registries": {
    "froniq": "https://raw.githubusercontent.com/Subhadipjana95/subhadip-ui/main/packages/registry/public/r"
  }
}
```

3.  Now you can install components using the shorthand:

```bash
npx shadcn@latest add @froniq/button
```

## Adding New Components

1.  Add source files to the directory structure (e.g. `components/new-comp`).
2.  Update `packages/registry/registry.json`.
3.  Run build:
    ```bash
    cd packages/registry
    npm run build
    ```
4.  Commit and push changes to GitHub.
