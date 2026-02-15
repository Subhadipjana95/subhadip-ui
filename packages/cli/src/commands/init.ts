import chalk from "chalk"
import { initShadcn } from "../utils/install.js"
import { configureRegistryAlias } from "../utils/registry.js"

export async function initProject() {
  console.log(chalk.bold.blue("🎨 Welcome to Froniq UI!\n"))

  try {
    await initShadcn()
    await configureRegistryAlias()
    
    console.log(chalk.green("\n✔ Setup complete! You can now add components."))
    console.log(chalk.blue("  froniq-ui add button"))
    console.log(chalk.blue("  shardcn add @froniq/button\n"))
    
    console.log(chalk.green("\n✔ Configured @froniq registry alias in components.json"))
  } catch (error) {
    // Error is already logged in initShadcn
    process.exit(1)
  }
}

