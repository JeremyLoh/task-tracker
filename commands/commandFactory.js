const { Task } = require("../model/task")
const { getAllTasks } = require("../storage/file")
const { AddCommand } = require("./addCommand")
const { DeleteCommand } = require("./deleteCommand")
const { InvalidCommand } = require("./invalidCommand")
const { ListCommand } = require("./listCommand")
const { MarkDoneCommand } = require("./markDoneCommand")
const { MarkInProgressCommand } = require("./markInProgressCommand")
const { UpdateCommand } = require("./updateCommand")

class CommandFactory {
  static createCommand(line) {
    const words = line.trim().split(/\s+/)
    const commandKeyword = words[0].toLowerCase()
    switch (commandKeyword) {
      case "list":
        return createListCommand(line)
      case "add":
        return createAddCommand(line)
      case "mark-done":
        return createMarkDoneCommand(line)
      case "mark-in-progress":
        return createMarkInProgressCommand(line)
      case "update":
        return createUpdateCommand(line)
      case "delete":
        return createDeleteCommand(line)
      default:
        return new InvalidCommand(line)
    }
  }
}

function createListCommand(line) {
  const listType = ListCommand.getListType(line.slice(4).trim())
  return listType == null
    ? new InvalidCommand(line)
    : new ListCommand(getAllTasks(), listType)
}

function createAddCommand(line) {
  const { isValid, description } = AddCommand.parseInput(line)
  return isValid
    ? new AddCommand(new Task(description))
    : new InvalidCommand(line)
}

function createMarkDoneCommand(line) {
  const words = line.trim().split(/\s+/)
  try {
    return new MarkDoneCommand(
      getAllTasks(),
      Number.parseInt(words[1].trim()) - 1
    )
  } catch (error) {
    return new InvalidCommand(line)
  }
}

function createMarkInProgressCommand(line) {
  const words = line.trim().split(/\s+/)
  try {
    return new MarkInProgressCommand(
      getAllTasks(),
      Number.parseInt(words[1].trim()) - 1
    )
  } catch (error) {
    return new InvalidCommand(line)
  }
}

function createUpdateCommand(line) {
  const { isValid, index, description } = UpdateCommand.parseInput(
    line.slice(6).trim()
  )
  return isValid
    ? new UpdateCommand(getAllTasks(), index, description)
    : new InvalidCommand(line)
}

function createDeleteCommand(line) {
  const { isValid, index } = DeleteCommand.parseInput(line.slice(6).trim())
  if (!isValid) {
    return new InvalidCommand(line)
  }
  return new DeleteCommand(getAllTasks(), index)
}

module.exports = { CommandFactory }
