#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const clc = require("cli-color")

const { hasFlag, initSockets, createMethod, initApi, createRoute, commands, commandCheck } = require("./helpers")

const { dir, arguments, flags, argString, command, validUsage } = commandCheck()

if (!validUsage) return

/**
 * INIT APP COMMAND
 */

if (commands.init.triggers.includes(command)) {
  let ok = true

  const check = [
    { loc: "package.json", exist: false }, 
    { loc: "index.js", exist: false }, 
    { loc: "/socket", exist: false }, 
    { loc: "/api", exist: false }, 
    { loc: "/helpers", exist: false }, 
    { loc: ".eslintrc.js", exist: true }, 
    { loc: ".gitignore", exist: true }
  ].map(({loc, exist}) => {
      if (fs.existsSync(`${dir}/${loc}`)) {
        if (ok === true) ok = exist === true
        return { loc, exists: true, okay: exist === true }
      } else {
        return { loc, exists: true, okay: true }
      }
    })

  if (ok === false && !hasFlag("force")) 
    return console.error(clc.red("Error Project Exists."), `Run "gch-cli ${argString} --force" to force recreation.`, clc.red("\nWarning! This will overwrite your project files."))

  const create = fs.readdirSync(path.join(__dirname, "/files")).map(file => ({ file, name: file.replace(/-/g, "/") }))

  fs.mkdirSync(`${dir}/socket/methods`, { recursive: true })
  fs.mkdirSync(`${dir}/helpers`, { recursive: true })
  fs.mkdirSync(`${dir}/api`, { recursive: true })

  create.forEach(({file, name}) => {
    fs.writeFileSync(`${dir}/${name}`, fs.readFileSync(path.join(__dirname, `/files/${file}`)), { recursive: true })
  })

  console.log(clc.green("Initialized the projects folders and files..."))
  console.log(clc.green("Be sure to run \"npm i\" to install all dependencies, and run \"npm run dev\" to run in dev mode."))
}


/**
 * SOCKET METHOD COMMAND
 */

const overwriteSocket = clc.red("\nWarning! This will overwrite your socket files.")

if (commands.socket.triggers.includes(command)) {
  const action = arguments[1]

  const socketExists = fs.existsSync(`${dir}/socket`)

  if (socketExists === false || action === "init") {
    if (action !== "init" && !hasFlag("force"))
      return console.error(clc.red("Error Socket Folder Doesn't Exists."), `Run "gch-cli ${argString} --force" to force creation.`)
    else if (socketExists && action === "init") 
      return console.error(clc.red("Error Socket Folder Exists."), `Run "gch-cli ${argString} --force" to force recreation.`, overwriteSocket)

    initSockets()

    if (action === "init") return
  }

  if (fs.existsSync(`${dir}/socket/methods`) === false) {
    if (!hasFlag("force"))
      return console.error(clc.red("Error Socket Methods Folder Doesn't Exists."), `Run "gch-cli ${argString} --force" to force creation.`, overwriteSocket)

    initSockets()
  }

  return createMethod(action)
}

/**
 * API ROUTE COMMAND
 */

const overwriteApi = clc.red("\nWarning! This will overwrite your api files.")

if (commands.api.triggers.includes(command)) {
  const action = arguments[1]

  const apiExists = fs.existsSync(`${dir}/api`)

  if (apiExists === false || action === "init") {
    if (action !== "init" && !hasFlag("force"))
      return console.error(clc.red("Error API Folder Doesn't Exists."), `Run "gch-cli ${argString} --force" to force creation.`)
    else if (apiExists && action === "init") 
      return console.error(clc.red("Error API Folder Exists."), `Run "gch-cli ${argString} --force" to force recreation.`, overwriteSocket)

    initApi()

    if (action === "init") return
  }

  return createRoute(action)
}

