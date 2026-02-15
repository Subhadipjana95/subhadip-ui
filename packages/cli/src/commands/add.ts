import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import axios from "axios"
import ora from "ora"
import {
  isTypeScriptProject,
  hasShadcnConfig,
  getComponentsPath,
  getUtilsPath,
  hasPackageInstalled,
} from "../utils/detect.js"
import { fetchFile } from "../utils/fetch.js"
import { ensureShadcnEnvironment } from "../utils/install.js"
import { installPackages } from "../utils/pkg.js"

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
    console.log(chalk.blue(`📦 Fetching ${componentName} component...\n`))
    
    // Fetch registry first to make sure component exists
    const registry = await axios.get(`${BASE_URL}/registry.json`)
    const componentData: ComponentData = registry.data[componentName]

    if (!componentData) {
      console.log(chalk.red(`❌ Component "${componentName}" not found in registry`))
      console.log(chalk.yellow(`Available components: ${Object.keys(registry.data).join(", ")}`))
      return
    }

    // Ensure Shadcn environment (components.json + tailwind)
    // If not present, this will run 'npx shadcn@latest init'
    await ensureShadcnEnvironment()

    // Config is guaranteed to exist here
    const componentsPath = getComponentsPath()
    const utilsPath = getUtilsPath()

    // Install component-specific dependencies (that might not be in shadcn base)
    await installComponentDependencies(componentData)

    // Install registry dependencies (recursive)
    if (componentData.registryDependencies && componentData.registryDependencies.length > 0) {
      console.log(chalk.gray("\nChecking registry dependencies..."))
      for (const dep of componentData.registryDependencies) {
        // Skip "utils" since it's handled by shadcn init
        if (dep !== componentName && dep !== "utils") {
          await addComponent(dep)
        }
      }
    }

    // Download and install component files
    console.log(chalk.gray("\nInstalling component files..."))
    await downloadComponentFiles(componentName, componentData, componentsPath, utilsPath)

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
      // Don't install core shadcn deps as they are handled by init
      // But do check if they are missing for some reason
      const isCoreDep = ["react", "react-dom", "tailwindcss", "clsx", "tailwind-merge", "class-variance-authority"].includes(dep)
      
      if (!hasPackageInstalled(dep) && !isCoreDep) {
        toInstall.push(`${dep}@${version}`)
      }
    }
  }

  // Install missing dependencies
  if (toInstall.length > 0) {
    console.log(chalk.blue(`Installing dependencies: ${toInstall.join(", ")}`))
    await installPackages(toInstall, false)
  }

  if (toInstallDev.length > 0) {
    console.log(chalk.blue(`Installing devDependencies: ${toInstallDev.join(", ")}`))
    await installPackages(toInstallDev, true)
  }
}

async function downloadComponentFiles(
  componentName: string,
  componentData: ComponentData,
  componentsPath: string,
  utilsPath: string
): Promise<void> {
  const extension = isTypeScriptProject() ? "tsx" : "jsx"
  const jsExtension = isTypeScriptProject() ? "ts" : "js"

  for (const file of componentData.files) {
    let remotePath = file.path
    let targetPath: string

    // Handle different file types
    if (remotePath.includes("lib/utils")) {
      // Utils file - we typically skip this as shadcn init handles it,
      // but if the registry has a specialized utility, we might want to update it.
      // For now, let's respect the existing utils from shadcn init.
      continue 
    } else {
      // Component file
      remotePath = remotePath.replace(".tsx", `.${extension}`)
      const fileName = path.basename(remotePath)
      targetPath = path.join(
        process.cwd(),
        componentsPath,
        fileName
      )
    }

    const fileUrl = `${BASE_URL}/${remotePath}`

    const spinner = ora(`Downloading ${path.basename(remotePath)}...`).start()
    
    try {
      const fileContent = await fetchFile(fileUrl)
      
      // Update utils import if necessary
      // shadcn components usually import cn from "@/lib/utils"
      // We might need to adjust this based on the project alias config?
      // For now, assuming standard shadcn structure.
      
      await fs.ensureDir(path.dirname(targetPath))
      await fs.writeFile(targetPath, fileContent)
      
      spinner.succeed(`Created ${path.relative(process.cwd(), targetPath)}`)
    } catch (error) {
      spinner.fail(`Failed to download ${path.basename(remotePath)}`)
      throw error
    }
  }
}
