import { execa } from "execa"
import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import ora from "ora"
import { getPackageManager } from "./detect.js"

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
  
  if (!hasShadcnConfig()) {
    console.log(chalk.yellow("⚠ shadcn-ui configuration (components.json) not found."))
    console.log(chalk.blue("Froniq UI requires a shadcn-ui compatible environment."))
    
    await initShadcn()
  }
}
