import { execa } from "execa"
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
