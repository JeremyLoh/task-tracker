const fs = require("fs")
const path = require("path")

const SAVE_FILE_PATH = path.join(__dirname, "data.json")

function getSaveFileContent() {
  try {
    return fs.readFileSync(SAVE_FILE_PATH, "utf8")
  } catch (error) {
    return null
  }
}

function getTotalTaskCount() {
  try {
    const data = getSaveFileContent(SAVE_FILE_PATH)
    if (data == null) {
      return 0
    }
    const tasks = JSON.parse(data)
    return tasks.length
  } catch (error) {
    return 0
  }
}

function createSaveFile() {
  if (!fs.existsSync(SAVE_FILE_PATH)) {
    fs.writeFileSync(SAVE_FILE_PATH, "")
  }
}

function writeToSaveFile(data) {
  fs.writeFileSync(SAVE_FILE_PATH, data)
}

module.exports = {
  SAVE_FILE_PATH,
  getSaveFileContent,
  getTotalTaskCount,
  createSaveFile,
  writeToSaveFile,
}
