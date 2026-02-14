import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import axios from "axios"
import { isTypeScriptProject } from "../utils/detect.js"
import { fetchFile } from "../utils/fetch.js"

// You can set this via environment variable: REGISTRY_URL=https://your-domain.com
const BASE_URL = process.env.REGISTRY_URL || "https://raw.githubusercontent.com/Subhadipjana95/subhadip-ui/main/packages/registry"

export async function addComponent(component: string) {
  try {
    console.log(chalk.blue(`📦 Fetching ${component} component...`))
    
    const registry = await axios.get(`${BASE_URL}/registry.json`)
    const componentData = registry.data[component]

    if (!componentData) {
      console.log(chalk.red(`❌ Component "${component}" not found in registry`))
      console.log(chalk.yellow(`Available components: ${Object.keys(registry.data).join(", ")}`))
      return
    }

    const extension = isTypeScriptProject() ? "tsx" : "jsx"

    for (const file of componentData.files) {
      const remotePath = file.path.replace(".tsx", `.${extension}`)
      const fileUrl = `${BASE_URL}/${remotePath}`

      console.log(chalk.gray(`  Downloading ${remotePath}...`))
      const fileContent = await fetchFile(fileUrl)

      const targetPath = path.join(
        process.cwd(),
        "components/ui",
        `${component}.${extension}`
      )

      await fs.ensureDir(path.dirname(targetPath))
      await fs.writeFile(targetPath, fileContent)
      console.log(chalk.gray(`  ✓ Created ${targetPath}`))
    }

    console.log(chalk.green(`✔ ${component} added successfully!`))
  } catch (error) {
    console.log(chalk.red("❌ Something went wrong:"))
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