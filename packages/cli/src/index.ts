#!/usr/bin/env node

import { Command } from "commander"
import { addComponent } from "./commands/add.js"

const program = new Command()

program
  .name("froniq-ui")
  .description("Add components to your project")
  .version("1.0.0")

program
  .command("add")
  .argument("<component>")
  .action(async (component) => {
    await addComponent(component)
  })

program.parse()