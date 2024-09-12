class InvalidCommand {
  constructor(input) {
    this.input = input
  }

  execute() {
    return `Invalid Command [${this.input}] given.
    List of valid commands:
    add "[TASK_DESCRIPTION]"
    update [TASK_ID] "[NEW_TASK_DESCRIPTION]"
    mark-in-progress [TASK_ID]
    mark-done [TASK_ID]
    list
    list done
    list todo
    list in-progress`
  }
}

module.exports = { InvalidCommand }
