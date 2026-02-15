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
 * Check if froniq-ui config file exists
 */
export function hasConfig(): boolean {
  return fs.existsSync(path.join(process.cwd(), "froniq-ui.json"))
}

/**
 * Get the config file contents
 */
export function getConfig(): any {
  const configPath = path.join(process.cwd(), "froniq-ui.json")
  
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
 * Check if utils file exists
 */
export function hasUtilsFile(): boolean {
  const config = getConfig()
  const utilsPath = config?.paths?.utils || "lib/utils"
  const extension = isTypeScriptProject() ? "ts" : "js"
  
  return fs.existsSync(
    path.join(process.cwd(), `${utilsPath}.${extension}`)
  )
}