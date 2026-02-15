#!/usr/bin/env node

import { Command } from "commander"
import { addComponent } from "./commands/add.js"
import { initProject } from "./commands/init.js"

const program = new Command()

program
  .name("froniq-ui")
  .description("Add components to your project")
  .version("1.0.2")

program
  .command("init")
  .description("Initialize froniq-ui in your project")
  .action(async () => {
    await initProject()
  })

program
  .command("add")
  .argument("<component>")
  .description("Add a component to your project")
  .action(async (component) => {
    await addComponent(component)
  })

program.parse()