# task-tracker

CLI app to track your tasks and manage your to-do list

https://roadmap.sh/projects/task-tracker

Build a simple command line interface (CLI) to track what you need to do, what you have done, and what you are currently working on.
Practice working with the filesystem, handling user inputs, and building a simple CLI application

# Running the application

Execute the following command

```bash
node index.js
```

The save file will be created at the `/storage` directory of the project, as file `data.json`

# Running tests

## To prevent flaky tests due to writing to same save json file, ensure vitest is running with flag `vitest --sequence.concurrent=false --no-file-parallelism`

https://vitest.dev/guide/improving-performance#test-isolation

The tests are written with `vitest`, with `mock-stdin` and `stdout-stderr` npm package for helping to pass stdin inputs to test cases and check stdout

Install the required package (`mock-stdin`, `stdout-stderr`) and run the tests

```bash
npm install
npm run test
```

The save file will be deleted before and after a test case run

# References

1. vitest - https://vitest.dev/
2. mock-stdin (for testing cli application) - https://www.npmjs.com/package/mock-stdin
3. stdout-stderr (for testing cli application) - https://www.npmjs.com/package/stdout-stderr
4. node.js equivalent of python's if `__name__` == `'__main__'` https://stackoverflow.com/questions/4981891/node-js-equivalent-of-pythons-if-name-main

# Requirements

The application should run from the command line, accept user actions and inputs as arguments, and store the tasks in a JSON file. The user should be able to:

- Add, Update, and Delete tasks
- Mark a task as in progress or done
- List all tasks
- List all tasks that are done
- List all tasks that are not done
- List all tasks that are in progress

Here are some constraints to guide the implementation:

- You can use any programming language to build this project.
- Use positional arguments in command line to accept user inputs.
- Use a JSON file to store the tasks in the current directory.
- The JSON file should be created if it does not exist.
- Use the native file system module of your programming language to interact with the JSON file.
- Do not use any external libraries or frameworks to build this project.
- Ensure to handle errors and edge cases gracefully.

## Example

The list of commands and their usage is given below:

```bash
# Adding a new task
task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
task-cli update 1 "Buy groceries and cook dinner"
task-cli delete 1

# Marking a task as in progress or done
task-cli mark-in-progress 1
task-cli mark-done 1

# Listing all tasks
task-cli list

# Listing tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress
```

## Task Properties

Each task should have the following properties:

- `id`: A unique identifier for the task
- `description`: A short description of the task
- `status`: The status of the task (todo, in-progress, done)
- `createdAt`: The date and time when the task was created
- `updatedAt`: The date and time when the task was last updated

Make sure to add these properties to the JSON file when adding a new task and update them when updating a task.
