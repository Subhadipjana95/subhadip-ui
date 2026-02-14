my-ui/
│
├── apps/
│   └── docs/                # Next.js documentation site
│
├── packages/
│   ├── registry/            # Raw component files (hosted remotely)
│   │   ├── registry.json
│   │   └── components/
│   │       ├── button/
│   │       │   ├── button.tsx
│   │       │   └── button.jsx
│   │       └── card/
│   │           ├── card.tsx
│   │           └── card.jsx
│   │
│   └── cli/                 # CLI tool
│       ├── src/
│       │   ├── index.ts
│       │   ├── commands/
│       │   │   └── add.ts
│       │   ├── utils/
│       │   │   ├── detect.ts
│       │   │   └── fetch.ts
│       │
│       ├── tsup.config.ts
│       └── package.json
│
├── package.json
├── pnpm-workspace.yaml
└── turbo.json