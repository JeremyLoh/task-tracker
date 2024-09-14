const { writeToSaveFile } = require("../storage/file")

class DeleteCommand {
  constructor(tasks, index) {
    // index is zero based
    this.tasks = tasks
    this.index = index - 1
  }

  static parseInput(input) {
    const found = input.trim().match(new RegExp(String.raw`^(?<index>-?\d+)$`))
    if (found == null || found.groups == null || found.groups.index == null) {
      return { isValid: false }
    }
    try {
      const index = Number.parseInt(found.groups.index)
      return {
        index,
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
    // update task ids strings (prevent issue with adding new tasks due to id conflict)
    const remainingTasks = this.tasks
      .filter((_, index) => index !== this.index)
      .map((task, index) => ({ ...task, id: `${index + 1}` }))
    writeToSaveFile(JSON.stringify(remainingTasks))
    return `Deleted Task ${this.index + 1}`
  }
}

module.exports = { DeleteCommand }
