# Froniq UI - Implementation Guide

## 🎉 Integration with shadcn-ui

Froniq UI now tightly integrates with **shadcn-ui** to provide a seamless developer experience.

### ✅ Key Features

1. **✅ Automatic shadcn Environment Setup**
   - If `shadcn-ui` is not initialized (missing `components.json`), Froniq UI automatically runs `npx shadcn@latest init`.
   - Before initialization, it **automatically checks and fixes** environment issues:
     - Adds missing TypeScript path aliases (`@/*`) to `tsconfig.json`.
     - Configures Vite path aliases (`resolve.alias`) in `vite.config.ts`.
   - This ensures a standard, robust foundation (Tailwind CSS, utils, project structure).

2. **✅ shadcn Configuration Support**
   - Reads `components.json` to understand your project structure.
   - Respects your `aliases` for `components` and `utils`.
   - Installs Froniq UI components into your configured components directory.

3. **✅ Smart Dependency Management**
   - Skips installation of base dependencies (React, Tailwind, clsx, etc.) as they are handled by shadcn.
   - Automatically installs extra component-specific dependencies (e.g., `framer-motion`, `lucide-react`).
   - Recursively installs registry dependencies (other Froniq UI components).

---

## 📦 How It Works

### Adding Components

```bash
# Add a component
npx froniq-ui@latest add button
```

**Scenario 1: New Project**
1. CLI detects missing `components.json`.
2. CLI runs `npx shadcn@latest init` (interactive setup).
3. Once initialized, CLI installs the `button` component.

**Scenario 2: Existing shadcn Project**
1. CLI detects `components.json`.
2. CLI resolves your components path (e.g., `@/components/ui`).
3. CLI installs the `button` component and any extra dependencies.

---

## 🔧 Registry Structure

The registry remains the same, but the CLI smart-skips "utils" and core libs:

```json
{
  "button": {
    "files": [{ "path": "components/button/button.tsx" }],
    "dependencies": [],
    "peerDependencies": {
      "react": "^18.0.0",
      "tailwindcss": "^3.0.0",
      "class-variance-authority": "^0.7.0",
      "clsx": "^2.0.0",
      "tailwind-merge": "^2.0.0"
    },
    "registryDependencies": ["utils"]
  }
}
```

- **`utils`**: Skipped during install because shadcn init creates `lib/utils.ts`.
- **`peerDependencies`**: Core libs skipped if present/handled by shadcn.

---

## 🚀 Usage Examples

### Fresh Start

```bash
npx create-next-app@latest my-app
cd my-app
npx froniq-ui@latest add button
```

- Prompts to install `shadcn@latest init`.
- You select options (TypeScript, style, base color, etc.).
- `button` is installed to `components/` (or your chosen path).

---

## 🔍 Comparison to Manual Setup

| Feature        | Old Manual Setup               | New shadcn Integration        |
| -------------- | ------------------------------ | ----------------------------- |
| Tailwind Setup | Custom logic (prone to errors) | ✅ `shadcn init` (Standard)    |
| Utils File     | Manually created               | ✅ `shadcn init` (Standard)    |
| Component Path | `froniq-ui.json`               | ✅ `components.json`           |
| Reliability    | Low (guessing environment)     | ✅ High (Standard environment) |
| Maintenance    | High (maintain setup scripts)  | ✅ Low (leverage shadcn)       |

---

## 📝 Next Steps

You can now publish this version (`v1.2.0`) to npm. Users will get the new behavior immediately.
