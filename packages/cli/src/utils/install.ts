import { execa } from "execa"
import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import ora from "ora"
import { getPackageManager, isTypeScriptProject, getConfig } from "./detect.js"

/**
 * Install npm packages
 */
export async function installPackages(
  packages: string[],
  isDev: boolean = false
): Promise<void> {
  if (packages.length === 0) return

  const packageManager = getPackageManager()
  const spinner = ora(`Installing ${packages.join(", ")}...`).start()

  try {
    const args: string[] = []
    
    switch (packageManager) {
      case "npm":
        args.push("install", isDev ? "--save-dev" : "--save", ...packages)
        break
      case "pnpm":
        args.push("add", isDev ? "-D" : "", ...packages)
        break
      case "yarn":
        args.push("add", isDev ? "-D" : "", ...packages)
        break
      case "bun":
        args.push("add", isDev ? "-d" : "", ...packages)
        break
    }

    await execa(packageManager, args.filter(Boolean), {
      cwd: process.cwd(),
    })

    spinner.succeed(`Installed ${packages.join(", ")}`)
  } catch (error) {
    spinner.fail(`Failed to install ${packages.join(", ")}`)
    throw error
  }
}

/**
 * Install Tailwind CSS
 */
export async function installTailwind(): Promise<void> {
  const spinner = ora("Installing Tailwind CSS...").start()

  try {
    // Install Tailwind and its peer dependencies
    await installPackages(
      ["tailwindcss", "autoprefixer", "postcss"],
      true
    )

    // Initialize Tailwind config
    await execa("npx", ["tailwindcss", "init", "-p"], {
      cwd: process.cwd(),
    })

    spinner.succeed("Tailwind CSS installed and configured")

    // Update tailwind.config
    await updateTailwindConfig()
  } catch (error) {
    spinner.fail("Failed to install Tailwind CSS")
    throw error
  }
}

/**
 * Update Tailwind config with content paths
 */
export async function updateTailwindConfig(): Promise<void> {
  const configFiles = [
    "tailwind.config.js",
    "tailwind.config.ts",
    "tailwind.config.mjs",
    "tailwind.config.cjs",
  ]

  const configFile = configFiles.find(file =>
    fs.existsSync(path.join(process.cwd(), file))
  )

  if (!configFile) return

  const configPath = path.join(process.cwd(), configFile)
  const isTS = configFile.endsWith(".ts")

  const newConfig = `${isTS ? "import type { Config } from \"tailwindcss\"" : "/** @type {import('tailwindcss').Config} */"}

${isTS ? "const config: Config = " : "module.exports = "}{
  darkMode: ["class"],
  content: [
    "./pages/**/*.{${isTS ? "ts,tsx" : "js,jsx"}}",
    "./components/**/*.{${isTS ? "ts,tsx" : "js,jsx"}}",
    "./app/**/*.{${isTS ? "ts,tsx" : "js,jsx"}}",
    "./src/**/*.{${isTS ? "ts,tsx" : "js,jsx"}}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}${isTS ? "\n\nexport default config" : ""}
`

  await fs.writeFile(configPath, newConfig)
  console.log(chalk.gray("  ✓ Updated Tailwind config"))
}

/**
 * Install shadcn base dependencies
 */
export async function installShadcnBase(): Promise<void> {
  const packages = [
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ]

  await installPackages(packages, false)
}

/**
 * Create utils file with cn helper
 */
export async function createUtilsFile(): Promise<void> {
  const config = getConfig()
  const utilsPath = config?.paths?.utils || "lib/utils"
  const extension = isTypeScriptProject() ? "ts" : "js"
  const fullPath = path.join(process.cwd(), `${utilsPath}.${extension}`)

  // Create directory if it doesn't exist
  await fs.ensureDir(path.dirname(fullPath))

  const content = isTypeScriptProject()
    ? `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
    : `import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
`

  await fs.writeFile(fullPath, content)
  console.log(chalk.gray(`  ✓ Created ${utilsPath}.${extension}`))
}

/**
 * Ensure Tailwind is installed
 */
export async function ensureTailwindInstalled(): Promise<void> {
  const { hasTailwindCSS, hasPackageInstalled } = await import("./detect.js")
  
  if (!hasTailwindCSS() || !hasPackageInstalled("tailwindcss")) {
    console.log(chalk.yellow("⚠ Tailwind CSS not found. Installing..."))
    await installTailwind()
  }
}

/**
 * Ensure shadcn base dependencies are installed
 */
export async function ensureShadcnBaseInstalled(): Promise<void> {
  const { hasPackageInstalled } = await import("./detect.js")
  
  const requiredPackages = [
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ]

  const missingPackages = requiredPackages.filter(
    pkg => !hasPackageInstalled(pkg)
  )

  if (missingPackages.length > 0) {
    console.log(chalk.yellow(`⚠ Installing base dependencies: ${missingPackages.join(", ")}`))
    await installShadcnBase()
  }
}

/**
 * Ensure utils file exists
 */
export async function ensureUtilsFileExists(): Promise<void> {
  const { hasUtilsFile } = await import("./detect.js")
  
  if (!hasUtilsFile()) {
    console.log(chalk.yellow("⚠ Utils file not found. Creating..."))
    await createUtilsFile()
  }
}
