const { getSaveFileContent, writeToSaveFile } = require("../storage/file")

class AddCommand {
  constructor(task) {
    this.task = task
  }

  static parseInput(input) {
    // only text in double quotes are added
    const hasTwoDoubleQuote =
      input.split("").filter((x) => x === '"').length === 2
    if (!hasTwoDoubleQuote) {
      return { isValid: false }
    }
    const found = input.match(/"(?<description>.+)"/)
    if (
      found == null ||
      found.groups == null ||
      found.groups.description.trim().length === 0
    ) {
      return { isValid: false }
    }
    return { isValid: true, description: found.groups.description.trim() }
  }

  execute() {
    const existingContent = getSaveFileContent()
    if (existingContent == null || existingContent === "") {
      writeToSaveFile("[" + this.task.toString() + "]")
    } else {
      const tasks = JSON.parse(existingContent)
      tasks.push(this.task.toJson())
      writeToSaveFile(JSON.stringify(tasks))
    }
    return `Task added successfully (ID: ${this.task.id})`
  }
}

module.exports = { AddCommand }
