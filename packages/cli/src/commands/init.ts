import chalk from "chalk"
import { initShadcn } from "../utils/install.js"

export async function initProject() {
  console.log(chalk.bold.blue("🎨 Welcome to Froniq UI!\n"))

  try {
    await initShadcn()
    console.log(chalk.green("\n✔ Setup complete! You can now add components."))
    console.log(chalk.blue("  froniq-ui add button\n"))
  } catch (error) {
    // Error is already logged in initShadcn
    process.exit(1)
  }
}

