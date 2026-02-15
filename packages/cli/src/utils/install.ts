import { execa } from "execa"
import chalk from "chalk"

/**
 * Initialize ShadCN project
 */
export async function initShadcn(): Promise<void> {
  console.log(chalk.blue("\n📦 Initializing shadcn-ui..."))
  console.log(chalk.gray("This will set up Tailwind CSS and the base component library structure."))
  
  try {
    // Run shadcn init with interaction
    await execa("npx", ["shadcn@latest", "init"], {
      cwd: process.cwd(),
      stdio: "inherit",
    })
    
    console.log(chalk.green("\n✔ shadcn-ui initialized successfully!"))
  } catch (error) {
    console.log(chalk.red("\n✖ Failed to initialize shadcn-ui"))
    throw error
  }
}

/**
 * Ensure Shadcn environment is set up
 */
export async function ensureShadcnEnvironment(): Promise<void> {
  const { hasShadcnConfig } = await import("./detect.js")
  const { configurePaths } = await import("./setup.js")
  
  // First ensure project paths are configured correctly (tsconfig paths, vite alias)
  await configurePaths(false)
  
  if (!hasShadcnConfig()) {
    console.log(chalk.yellow("⚠ shadcn-ui configuration (components.json) not found."))
    console.log(chalk.blue("Froniq UI requires a shadcn-ui compatible environment."))
    
    try {
      await initShadcn()
    } catch (e) {
      console.log(chalk.yellow("\n⚠ Initialization failed. This is often due to missing alias configuration."))
      
      // Force configuration check and setup
      await configurePaths(true)
      
      console.log(chalk.blue("Retrying shadcn initialization..."))
      await initShadcn()
    }
  }

  // Ensure registry alias is configured for future use
  const { configureRegistryAlias } = await import("./registry.js")
  await configureRegistryAlias()
}
