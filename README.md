# journal-cli
A command line script to automate journal entries


## Description
Invoking this script will automate the directory structure and file format for creating a daily journal entry.

The script will leverage config files if they exist that will specify the directory and file naming format. 

The file format can be of any type (text, markdown, or html for example) and if specified, will create based upon a file template.

It will also have the option to spawn an editor (env var or specific to the journal) once the file has been created.

## Technologies

- Javascript
- Node.js
- npm
  - yargs

## TODO
- [ ] Parse command line arguments
- [x] Parse config files
- [x] Create template file if needed in correct directory
- [x] Create directory/directories if needed
- [x] Open default or specified editor
- [ ] Show stats such as streaks, percent of TODO items complete, etc.
