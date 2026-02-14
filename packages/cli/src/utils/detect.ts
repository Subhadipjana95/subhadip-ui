import fs from "fs"
import path from "path"

export function isTypeScriptProject() {
  return fs.existsSync(
    path.join(process.cwd(), "tsconfig.json")
  )
}