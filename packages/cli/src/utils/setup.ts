import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import prompts from "prompts"
import { isTypeScriptProject } from "./detect.js"
import { installPackages } from "./pkg.js"

export async function configurePaths(force: boolean = false): Promise<void> {
  // Only proceed if it's a TypeScript project
  if (!isTypeScriptProject()) return

  const tsConfigPath = path.join(process.cwd(), "tsconfig.json")
  
  // 1. Check tsconfig.json
  if (fs.existsSync(tsConfigPath)) {
    try {
      const tsConfigContent = await fs.readFile(tsConfigPath, "utf-8")
      
      // Check if paths are configured
      const hasPaths = tsConfigContent.includes('"paths"') && tsConfigContent.includes("@/*")
      
      if (!hasPaths || force) {
        if (!force) {
          console.log(chalk.yellow("\n⚠ TypeScript path aliases (@/*) seem missing."))
        }
        
        const response = await prompts({
          type: "confirm",
          name: "fix",
          message: "Would you like me to configure tsconfig paths automatically?",
          initial: true,
        })
        
        if (response.fix) {
          try {
            // Try to parse as JSON
            const tsConfig = JSON.parse(tsConfigContent)
            
            if (!tsConfig.compilerOptions) tsConfig.compilerOptions = {}
            
            tsConfig.compilerOptions.baseUrl = "."
            tsConfig.compilerOptions.paths = {
              "@/*": ["./src/*"]
            }
            
            await fs.writeFile(tsConfigPath, JSON.stringify(tsConfig, null, 2))
            console.log(chalk.green("✔ Updated tsconfig.json"))
          } catch (e) {
            console.log(chalk.yellow("✖ Could not parse tsconfig.json (it might contain comments)."))
            console.log(chalk.blue("Please manually add these lines to your compilerOptions:"))
            console.log(chalk.white(`
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
            `))
          }
        }
      }
    } catch (e) {
      console.error(chalk.red("Failed to read tsconfig.json"))
    }
  }

  // 2. Check vite.config.ts (If it exists)
  const viteConfigPath = path.join(process.cwd(), "vite.config.ts")

  if (fs.existsSync(viteConfigPath)) {
    try {
      const viteContent = await fs.readFile(viteConfigPath, "utf-8")
      
      // Check if aliases are configured
      const hasAlias = viteContent.includes("resolve") && viteContent.includes("alias")
      
      if (!hasAlias || force) {
        if (!force) {
          console.log(chalk.yellow("\n⚠ Vite path aliases seem missing."))
        }
        
        const response = await prompts({
          type: "confirm",
          name: "fix",
          message: "Would you like me to configure Vite aliases automatically?",
          initial: true,
        })
        
        if (response.fix) {
            console.log(chalk.blue("Installing @types/node for path resolution..."))
            await installPackages(["@types/node"], true)
            
            let newContent = viteContent
            
            // Add import if missing
            if (!newContent.includes('import path from "path"')) {
              newContent = `import path from "path"\n` + newContent
            }
            
            // Inject alias
            if (!newContent.includes("resolve: {")) {
                if (newContent.includes("plugins: [")) {
                    newContent = newContent.replace(
                    "plugins: [",
                    `resolve: {
        alias: {
        "@": path.resolve(__dirname, "./src"),
        },
    },
    plugins: [`
                    )
                    
                    await fs.writeFile(viteConfigPath, newContent)
                    console.log(chalk.green("✔ Updated vite.config.ts"))
                }
            } else if (force) {
                 // If forced but struct likely exists, we warn
                 console.log(chalk.yellow("⚠ 'resolve' block already exists. Skipping manual injection to avoid corruption."))
            }
        }
      }
    } catch (e) {
       console.error(chalk.red("Failed to read vite.config.ts"))
    }
  }
}
