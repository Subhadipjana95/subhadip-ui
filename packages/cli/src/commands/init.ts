import chalk from "chalk"
import { ensureShadcnEnvironment } from "../utils/install.js"

export async function initProject() {
  console.log(chalk.bold.blue("🎨 Welcome to Froniq UI!\n"))

  try {
    await ensureShadcnEnvironment()
    
    console.log(chalk.green("\n✔ Setup complete! You can now add components."))
    console.log(chalk.blue("  froniq-ui add button"))
    console.log(chalk.blue("  npx shadcn@latest add @froniq/button\n"))
    
  } catch (error) {
    // ensureShadcnEnvironment handles most errors, but if it throws, we exit
    process.exit(1)
  }
}

