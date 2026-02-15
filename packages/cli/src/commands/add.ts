import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import axios from "axios"
import ora from "ora"
import prompts from "prompts"
import {
  isTypeScriptProject,
  hasConfig,
  getConfig,
  hasPackageInstalled,
} from "../utils/detect.js"
import { fetchFile } from "../utils/fetch.js"
import {
  ensureTailwindInstalled,
  ensureShadcnBaseInstalled,
  ensureUtilsFileExists,
  installPackages,
} from "../utils/install.js"

// You can set this via environment variable: REGISTRY_URL=https://your-domain.com
const BASE_URL = process.env.REGISTRY_URL || "https://raw.githubusercontent.com/Subhadipjana95/subhadip-ui/main/packages/registry"

interface ComponentData {
  files: Array<{ path: string }>
  dependencies?: string[]
  devDependencies?: string[]
  peerDependencies?: Record<string, string>
  registryDependencies?: string[]
}

export async function addComponent(componentName: string) {
  try {
    // Check if config exists
    if (!hasConfig()) {
      console.log(chalk.yellow("⚠ Config file not found. Please run:"))
      console.log(chalk.blue("  froniq-ui init\n"))
      
      const response = await prompts({
        type: "confirm",
        name: "continue",
        message: "Would you like to continue without config? (components will be installed to components/ui)",
        initial: false,
      })

      if (!response.continue) {
        process.exit(0)
      }
    }

    const config = getConfig() || {
      componentsPath: "components/ui",
      utilsPath: "lib/utils",
    }

    console.log(chalk.blue(`📦 Fetching ${componentName} component...\n`))
    
    // Fetch registry
    const registry = await axios.get(`${BASE_URL}/registry.json`)
    const componentData: ComponentData = registry.data[componentName]

    if (!componentData) {
      console.log(chalk.red(`❌ Component "${componentName}" not found in registry`))
      console.log(chalk.yellow(`Available components: ${Object.keys(registry.data).join(", ")}`))
      return
    }

    // Pre-flight checks
    console.log(chalk.gray("Checking dependencies..."))
    await ensureTailwindInstalled()
    await ensureShadcnBaseInstalled()
    await ensureUtilsFileExists()

    // Install component dependencies
    await installComponentDependencies(componentData)

    // Install registry dependencies (other components)
    if (componentData.registryDependencies && componentData.registryDependencies.length > 0) {
      console.log(chalk.gray("\nInstalling registry dependencies..."))
      for (const dep of componentData.registryDependencies) {
        if (dep !== componentName) {
          await addComponent(dep)
        }
      }
    }

    // Download and install component files
    console.log(chalk.gray("\nInstalling component files..."))
    await downloadComponentFiles(componentName, componentData, config)

    console.log(chalk.green(`\n✔ ${componentName} added successfully!\n`))
  } catch (error) {
    console.log(chalk.red("\n❌ Something went wrong:"))
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.log(chalk.yellow("Registry not found. Please check your BASE_URL configuration."))
        console.log(chalk.gray(`Current URL: ${BASE_URL}`))
      } else {
        console.log(chalk.red(error.message))
      }
    } else if (error instanceof Error) {
      console.log(chalk.red(error.message))
    }
    process.exit(1)
  }
}

async function installComponentDependencies(componentData: ComponentData): Promise<void> {
  const toInstall: string[] = []
  const toInstallDev: string[] = []

  // Check regular dependencies
  if (componentData.dependencies) {
    for (const dep of componentData.dependencies) {
      if (!hasPackageInstalled(dep)) {
        toInstall.push(dep)
      }
    }
  }

  // Check dev dependencies
  if (componentData.devDependencies) {
    for (const dep of componentData.devDependencies) {
      if (!hasPackageInstalled(dep)) {
        toInstallDev.push(dep)
      }
    }
  }

  // Check peer dependencies
  if (componentData.peerDependencies) {
    for (const [dep, version] of Object.entries(componentData.peerDependencies)) {
      if (!hasPackageInstalled(dep)) {
        toInstall.push(`${dep}@${version}`)
      }
    }
  }

  // Install missing dependencies
  if (toInstall.length > 0) {
    await installPackages(toInstall, false)
  }

  if (toInstallDev.length > 0) {
    await installPackages(toInstallDev, true)
  }
}

async function downloadComponentFiles(
  componentName: string,
  componentData: ComponentData,
  config: any
): Promise<void> {
  const extension = isTypeScriptProject() ? "tsx" : "jsx"
  const jsExtension = isTypeScriptProject() ? "ts" : "js"

  for (const file of componentData.files) {
    let remotePath = file.path
    let targetPath: string

    // Handle different file types
    if (remotePath.includes("lib/utils")) {
      // Utils file
      remotePath = remotePath.replace(".tsx", `.${jsExtension}`)
      targetPath = path.join(
        process.cwd(),
        config.utilsPath || "lib/utils",
        path.basename(remotePath)
      )
    } else {
      // Component file
      remotePath = remotePath.replace(".tsx", `.${extension}`)
      const fileName = path.basename(remotePath)
      targetPath = path.join(
        process.cwd(),
        config.componentsPath || "components/ui",
        fileName
      )
    }

    const fileUrl = `${BASE_URL}/${remotePath}`

    const spinner = ora(`Downloading ${path.basename(remotePath)}...`).start()
    
    try {
      const fileContent = await fetchFile(fileUrl)
      await fs.ensureDir(path.dirname(targetPath))
      await fs.writeFile(targetPath, fileContent)
      
      spinner.succeed(`Created ${path.relative(process.cwd(), targetPath)}`)
    } catch (error) {
      spinner.fail(`Failed to download ${path.basename(remotePath)}`)
      throw error
    }
  }
}
