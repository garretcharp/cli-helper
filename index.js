#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const clc = require("cli-color")

const { hasFlag, initSockets, createMethod, initApi, createRoute, commands, commandCheck } = require("./helpers")

const { dir, arguments, argString, command, validUsage } = commandCheck()

if (!validUsage) return

/**
 * INIT APP COMMAND
 */

else if (commands.init.triggers.includes(command)) {
  const directory = fs.readdirSync(dir)

  if (directory.length !== 0 && hasFlag("force") === false)
    return console.error(clc.red("Error Project Exists."), `Run "gch-cli ${argString} --force" to force recreation.`, clc.red("\nWarning! This will overwrite your project files."))

  const create = fs.readdirSync(path.join(__dirname, "/files")).map(file => ({ file, name: file.replace(/-/g, "/") }))

  fs.mkdirSync(`${dir}/socket/methods`, { recursive: true })
  fs.mkdirSync(`${dir}/helpers`, { recursive: true })
  fs.mkdirSync(`${dir}/api`, { recursive: true })

  create.forEach(({ file, name }) => {
    fs.writeFileSync(`${dir}/${name}`, fs.readFileSync(path.join(__dirname, `/files/${file}`)), { recursive: true })
  })

  console.log(clc.green("Initialized the projects folders and files..."))
  console.log(clc.green("Be sure to run \"npm i\" to install all dependencies, and run \"npm run dev\" to run in dev mode."))
}


/**
 * SOCKET METHOD COMMAND
 */

else if (commands.socket.triggers.includes(command)) {
  const action = arguments[1]

  // Initialize Default Socket Structure
  if (action === "init") {
    const socketExists = fs.existsSync(`${dir}/socket`)

    if (socketExists === true && hasFlag("force") === false)
      return console.error(clc.red("Error Socket Folder Exists."), `Run "gch-cli ${argString} --force" to force recreation.`, clc.red("\nWarning! This will overwrite your socket files."))

    return initSockets()
  }

  const methodsExists = fs.existsSync(`${dir}/socket/methods`)

  // Initialize Default Socket Structure -- If Not Exists && Forceful
  if (methodsExists === false) {
    if (hasFlag("force") === false)
      return console.error(clc.red("Error Socket Methods Folder Doesn't Exists."), `Run "gch-cli ${argString} --force" to force creation.`)

    initSockets()
  }

  return createMethod(action)
}

/**
 * API ROUTE COMMAND
 */

else if (commands.api.triggers.includes(command)) {
  const action = arguments[1]

  const apiExists = fs.existsSync(`${dir}/api`)

  // Initialize Default API Structure
  if (action === "init") {
    if (apiExists === true && hasFlag("force") === false)
      return console.error(clc.red("Error API Folder Exists."), `Run "gch-cli ${argString} --force" to force recreation.`, clc.red("\nWarning! This will overwrite your socket files."))

    return initApi()
  }

  // Initialize Default API Structure -- If Not Exists && Forceful
  if (apiExists === false) {
    if (hasFlag("force") === false)
      return console.error(clc.red("Error API Folder Doesn't Exists."), `Run "gch-cli ${argString} --force" to force creation.`)

    initApi()
  }

  return createRoute(action)
}

