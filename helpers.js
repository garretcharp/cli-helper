const fs = require("fs")
const path = require("path")
const clc = require("cli-color")

const dir = process.cwd()

let result = null
const run = () => {
  if (result !== null) return result // small cache no need to run this over & over

  const all = process.argv.slice(2)

  const arguments = all.filter(arg => !arg.startsWith("-"))
  const flags = all.filter(arg => arg.startsWith("-"))

  const argString = all.join(" ").trim()

  const command = arguments.length !== 0 ? arguments[0] : null

  result = {
    dir,
    arguments,
    flags,
    argString,
    command
  }

  return result
}

const flags = {
  force: ["--force", "-f"]
}

const hasFlag = (type) => flags[type] ? run().flags.some(flag => flags[type].includes(flag.toLowerCase())) : false


const initSockets = () => {
  fs.mkdirSync(`${dir}/socket/methods`, { recursive: true })

  fs.writeFileSync(`${dir}/socket/index.js`, fs.readFileSync(path.join(__dirname, "/files/socket-index.js")))
  fs.writeFileSync(`${dir}/socket/methods/index.js`, fs.readFileSync(path.join(__dirname, "/files/socket-methods-index.js")))
  fs.writeFileSync(`${dir}/socket/methods/test.js`, fs.readFileSync(path.join(__dirname, "/files/socket-methods-test.js")))

  console.log(clc.green("Initialized the sockets folders and files..."))
}

const createMethod = name => {
  if (fs.existsSync(`${dir}/socket/methods/${name}.js`) === true && hasFlag("force") === false)
    return console.error(clc.red("Warning Method Already Exists"), `Run "gch-cli ${process.argv.slice(2).join(" ")} --force" to force creation\n`, clc.red("Warning! This will overwrite your method."))

  fs.writeFileSync(`${dir}/socket/methods/${name}.js`, fs.readFileSync(path.join(__dirname, "/files/socket-methods-test.js")))

  // TODO: Attempt to modify the imports of the index file with the required method.

  console.log(clc.green(`Initialized method ${name}...`))
}

const initApi = () => {
  fs.mkdirSync(`${dir}/api`, { recursive: true })

  fs.writeFileSync(`${dir}/api/index.js`, fs.readFileSync(path.join(__dirname, "/files/api-index.js")))
  fs.writeFileSync(`${dir}/api/test.js`, fs.readFileSync(path.join(__dirname, "/files/api-test.js")))

  console.log(clc.green("Initialized the api folders and files..."))
}

const createRoute = name => {
  if (fs.existsSync(`${dir}/api/${name}.js`) === true && hasFlag("force") === false)
    return console.error(clc.red("Warning Route Already Exists"), `Run "gch-cli ${process.argv.slice(2).join(" ")} --force" to force creation\n`, clc.red("Warning! This will overwrite your route."))

  fs.writeFileSync(`${dir}/api/${name}.js`, fs.readFileSync(path.join(__dirname, "/files/api-test.js")))

  // TODO: Attempt to modify the imports of the index file with the required routes.

  console.log(clc.green(`Initialized route ${name}...`))
}

const commands = {
  init: {
    triggers: ["init"],
    desc: "Used to initialize the entire Hapi boiler with REST and WS APIs.",
    usage: "gch-cli init",
    argMin: 1
  },
  socket: {
    triggers: ["socket", "s"],
    desc: "Used to create a websocket server method.",
    usage: "gch-cli socket <method name || init>",
    argMin: 2
  },
  api: {
    triggers: ["api", "a"],
    desc: "Used to create a api server route.",
    usage: "gch-cli api <api route || init>",
    argMin: 2
  }
}

const commandCheck = () => {
  const vals = run()

  const { arguments, argString, command } = vals

  if (command) {
    const cmdKey = Object.keys(commands).find(key => {
      return commands[key].triggers.includes(command)
    })

    if (cmdKey) {
      const validUsage = arguments.length >= commands[cmdKey].argMin

      if (!validUsage) console.error(`${clc.red("Error Invalid Usage:")} "gch-cli ${argString}"\n\n${clc.green("Usage:")}`, commands[cmdKey].usage)

      return { ...vals, validUsage }
    }
  }


  console.error(clc.red("Error Command:"), `"gch-cli ${argString}"`, clc.red("Does not exists."), `\n${JSON.stringify(commands, null, 2)}`) // TODO: make this nice?
  return { ...vals, validUsage: false }
}

module.exports = { run, hasFlag, initSockets, createMethod, initApi, createRoute, commands, commandCheck }