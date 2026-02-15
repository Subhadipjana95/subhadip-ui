import fs from "fs-extra"
import path from "path"
import chalk from "chalk"

export async function configureRegistryAlias(): Promise<void> {
  const configPath = path.join(process.cwd(), "components.json")
  
  if (!fs.existsSync(configPath)) {
    return
  }

  try {
    const config = await fs.readJSON(configPath)
    
    // Check if registry is already configured
    if (config.registries && config.registries["froniq"]) {
      return
    }

    if (!config.registries) {
      config.registries = {}
    }
    
    // Add the registry alias
    config.registries["froniq"] = "https://raw.githubusercontent.com/Subhadipjana95/subhadip-ui/main/packages/registry/public/r"
    
    await fs.writeJSON(configPath, config, { spaces: 2 })
    console.log(chalk.green("✔ Configured '@froniq' registry alias in components.json"))
    console.log(chalk.gray("  You can now use: npx shadcn@latest add @froniq/component"))
  } catch (error) {
    console.warn(chalk.yellow("⚠ Failed to configure registry alias automatically."))
  }
}
