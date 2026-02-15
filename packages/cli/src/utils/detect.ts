import fs from "fs"
import path from "path"

/**
 * Check if the project uses TypeScript
 */
export function isTypeScriptProject(): boolean {
  return fs.existsSync(path.join(process.cwd(), "tsconfig.json"))
}

/**
 * Check if Tailwind CSS is installed
 */
export function hasTailwindCSS(): boolean {
  const tailwindConfig = [
    "tailwind.config.js",
    "tailwind.config.ts",
    "tailwind.config.mjs",
    "tailwind.config.cjs",
  ]
  
  return tailwindConfig.some(config => 
    fs.existsSync(path.join(process.cwd(), config))
  )
}

/**
 * Check if a package is installed in package.json
 */
export function hasPackageInstalled(packageName: string): boolean {
  const packageJsonPath = path.join(process.cwd(), "package.json")
  
  if (!fs.existsSync(packageJsonPath)) {
    return false
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
    }
    
    return packageName in allDeps
  } catch {
    return false
  }
}

/**
 * Detect which package manager is being used
 */
export function getPackageManager(): "npm" | "pnpm" | "yarn" | "bun" {
  const cwd = process.cwd()
  
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm"
  }
  
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn"
  }
  
  if (fs.existsSync(path.join(cwd, "bun.lockb"))) {
    return "bun"
  }
  
  return "npm"
}

/**
 * Check if shadcn components.json exists
 */
export function hasShadcnConfig(): boolean {
  return fs.existsSync(path.join(process.cwd(), "components.json"))
}

/**
 * Get the shadcn config
 */
export function getShadcnConfig(): any {
  const configPath = path.join(process.cwd(), "components.json")
  
  if (!fs.existsSync(configPath)) {
    return null
  }
  
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"))
  } catch {
    return null
  }
}

/**
 * Resolve utility file path from config
 */
export function getUtilsPath(): string {
  const config = getShadcnConfig()
  
  if (config?.aliases?.utils) {
    // Convert alias to path (e.g. "@/lib/utils" -> "lib/utils")
    return config.aliases.utils.replace(/^@\//, "")
  }
  
  return "lib/utils"
}

/**
 * Resolve components directory path from config
 */
export function getComponentsPath(): string {
  const config = getShadcnConfig()
  
  if (config?.aliases?.components) {
    return config.aliases.components.replace(/^@\//, "")
  }
  
  return "components"
}

/**
 * Check if utils file exists based on shadcn config
 */
export function hasUtilsFile(): boolean {
  const utilsPath = getUtilsPath()
  const extensions = ["ts", "tsx", "js", "jsx"]
  
  return extensions.some(ext => 
    fs.existsSync(path.join(process.cwd(), `${utilsPath}.${ext}`))
  )
}