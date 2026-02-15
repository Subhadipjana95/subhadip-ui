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
