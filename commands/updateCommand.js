const { writeToSaveFile } = require("../storage/file")

class UpdateCommand {
  constructor(tasks, index, description) {
    // index needs to be converted to zero based
    this.tasks = tasks
    this.index = index - 1
    this.description = description
  }

  static parseInput(input) {
    // parse number followed by text
    const found = input.trim().match(/(?<index>-?\d+)\s+"(?<description>.+)"/)
    if (
      found == null ||
      found.groups == null ||
      found.groups.description.trim().length === 0 ||
      found.groups.index == null
    ) {
      return { isValid: false }
    }
    try {
      const index = Number.parseInt(found.groups.index)
      return {
        index,
        description: found.groups.description.trim(),
        isValid: true,
      }
    } catch (error) {
      return { isValid: false }
    }
  }

  execute() {
    if (this.index < 0 || this.tasks[this.index] == null) {
      return `Invalid index provided [${this.index + 1}]`
    }
    this.tasks[this.index]["updatedAt"] = new Date().toString()
    this.tasks[this.index]["description"] = this.description
    writeToSaveFile(JSON.stringify(this.tasks))
    return `Updated Task ${this.index + 1} Description`
  }
}

module.exports = { UpdateCommand }
