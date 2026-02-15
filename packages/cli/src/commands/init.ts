import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import prompts from "prompts"
import ora from "ora"
import {
  isTypeScriptProject,
  hasTailwindCSS,
  hasPackageInstalled,
  getPackageManager,
} from "../utils/detect.js"
import {
  installTailwind,
  installShadcnBase,
  createUtilsFile,
} from "../utils/install.js"

interface InitConfig {
  typescript: boolean
  componentsPath: string
  utilsPath: string
  tailwindConfig: string
  tailwindCss: string
}

export async function initProject() {
  console.log(chalk.bold.blue("🎨 Welcome to Froniq UI!\n"))

  // Detect project setup
  const isTS = isTypeScriptProject()
  const hasTailwind = hasTailwindCSS()
  const hasReact = hasPackageInstalled("react")

  if (!hasReact) {
    console.log(chalk.red("❌ React not found in package.json"))
    console.log(chalk.yellow("Please install React first:"))
    console.log(chalk.gray(`  ${getPackageManager()} install react react-dom`))
    process.exit(1)
  }

  console.log(chalk.gray("Detected:"))
  console.log(chalk.gray(`  • TypeScript: ${isTS ? "Yes" : "No"}`))
  console.log(chalk.gray(`  • Tailwind CSS: ${hasTailwind ? "Yes" : "No"}`))
  console.log(chalk.gray(`  • Package Manager: ${getPackageManager()}\n`))

  // Prompt for configuration
  const response = await prompts([
    {
      type: "text",
      name: "componentsPath",
      message: "Where would you like to install components?",
      initial: "components/ui",
    },
    {
      type: "text",
      name: "utilsPath",
      message: "Where would you like to install utils?",
      initial: "lib/utils",
    },
    {
      type: "confirm",
      name: "installTailwind",
      message: "Would you like to install Tailwind CSS?",
      initial: !hasTailwind,
    },
  ])

  if (!response.componentsPath) {
    console.log(chalk.red("\n❌ Setup cancelled"))
    process.exit(0)
  }

  const config: InitConfig = {
    typescript: isTS,
    componentsPath: response.componentsPath,
    utilsPath: response.utilsPath,
    tailwindConfig: "tailwind.config." + (isTS ? "ts" : "js"),
    tailwindCss: "app/globals.css",
  }

  console.log("")

  try {
    // Install Tailwind if needed
    if (response.installTailwind && !hasTailwind) {
      await installTailwind()
    }

    // Install base dependencies
    const spinner = ora("Installing base dependencies...").start()
    await installShadcnBase()
    spinner.succeed("Base dependencies installed")

    // Create utils file
    await createUtilsFile()

    // Create config file
    const configPath = path.join(process.cwd(), "froniq-ui.json")
    await fs.writeJSON(configPath, config, { spaces: 2 })
    console.log(chalk.gray("  ✓ Created froniq-ui.json"))

    // Create CSS file with Tailwind directives if it doesn't exist
    await ensureCSSFile(config.tailwindCss)

    console.log(chalk.green("\n✔ Setup complete!\n"))
    console.log(chalk.gray("You can now add components:"))
    console.log(chalk.blue("  froniq-ui add button\n"))
  } catch (error) {
    console.log(chalk.red("\n❌ Setup failed"))
    if (error instanceof Error) {
      console.log(chalk.red(error.message))
    }
    process.exit(1)
  }
}

async function ensureCSSFile(cssPath: string): Promise<void> {
  const fullPath = path.join(process.cwd(), cssPath)
  
  // Check common CSS file locations
  const possiblePaths = [
    cssPath,
    "src/app/globals.css",
    "src/styles/globals.css",
    "styles/globals.css",
    "app/globals.css",
  ]

  let existingCssPath = possiblePaths.find(p =>
    fs.existsSync(path.join(process.cwd(), p))
  )

  if (!existingCssPath) {
    // Create the CSS file
    await fs.ensureDir(path.dirname(fullPath))
    
    const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;
`
    
    await fs.writeFile(fullPath, cssContent)
    console.log(chalk.gray(`  ✓ Created ${cssPath}`))
  } else {
    // Check if Tailwind directives exist
    const content = await fs.readFile(
      path.join(process.cwd(), existingCssPath),
      "utf-8"
    )

    if (!content.includes("@tailwind base")) {
      console.log(chalk.yellow(`\n⚠ Please add Tailwind directives to ${existingCssPath}:`))
      console.log(chalk.gray("  @tailwind base;"))
      console.log(chalk.gray("  @tailwind components;"))
      console.log(chalk.gray("  @tailwind utilities;\n"))
    }
  }
}
