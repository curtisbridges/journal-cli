#!/usr/bin/env node
// Leaving the above script notation for now. I don't think I want to invoke that way but
// I'm going to leave it here for reference.

// TODO: This script will not currently work in DOS/WIN based environments.

// imports
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn;
//const argv = require('yargs').argv
    // version
    // .alias('v', 'version')
    // .version(function () { return require('../package').version; })
    // .describe('v', 'show version information')

    // help text
    // .alias('h', 'help')
    // .help('help')

const keyvalue = require('./key-value');

// define the initial settings for this script
const configDir = process.env.XDG_CONFIG_HOME || normalizeHomeDir('.config')
const scriptConfigDir = `${configDir}/journal`
const scriptConfigFile = `${scriptConfigDir}/config`
const journalTemplateFile = `${scriptConfigDir}/template`

// TODO: Implement a config object rather than individual variables.
let DEBUG = false

let dataDir = normalizeHomeDir('Developer/Personal/journal')
let dirFormat = 'yyyy/mm'
let filetype = 'md'
let openEditor = false
let editor = process.env.VISUAL || process.env.EDITOR || 'vi'
let requestPermission = false
let stats = false

//
// Config file keys
//
const dataDirKey = 'data'
const templateKey = 'template'
const openEditorKey = 'openEditor'
const editorKey = 'editor'
const dirFormatKey = 'dirFormat'
const filetypeKey = 'filetype'
const permissionKey = 'permission'
const statsKey = 'stats'
const debugKey = 'debug'

//
// Main Execution Logic
//

// read config file. If it exists, it overrides the settings above.
//  - read directory format (yyyy/mm vs yy-mm vs ??)
//  - read file type
//  - read template name
//  - read template file
//  - read editor

readConfigFile()
const journalTemplate = readTemplateFile()

// parse command line args. If they exist, they override everything above.
//  possible args:
//      --editor=(editor executable name)
//      --filetype=(file extension)
//      --preview (explicitly state what script will do but don't do it)
//      --stats (print stats for consecutive days, percent of TODOs complete, etc.)

logSettings()

// switch to journal directory (create if necessary)
createJournalDir()

// create new journal entry
const journal = createJournalFileWithTemplate(journalTemplate)

// open file with default editor
openJournalWithEditor(journal, editor)

//
// Lower level functions
//

function normalizeHomeDir(dir) {
    const homeDir = require('os').homedir()
    return path.join(homeDir, dir)
}

function logSettings() {
    if (DEBUG) {
        console.log(`CONFIG DIR = ${configDir}`)
        console.log(`SCRIPT CONFIG DIR = ${scriptConfigDir}`)
        console.log(`SCRIPT CONFIG FILE = ${scriptConfigFile}`)

        console.log(`DATA DIR = ${dataDir}`)
        console.log(`DIR FORMAT = ${dirFormat}`)
        console.log(`FILETYPE = ${filetype}`)

        console.log(`OPEN EDITOR = ${openEditor}`)
        console.log(`EDITOR = ${editor}`)

        console.log(`REQUEST PERMISSIONS = ${requestPermission}`)
        console.log(`SHOW STATS = ${stats}`)
    }
}

function readConfigFile() {
    let settings = {}

    try {
        settings = keyvalue.readFromFile(scriptConfigFile)
        if (DEBUG) console.log(`SETTINGS = ${JSON.stringify(settings)}`)

        if (settings[dataDirKey]) dataDir = settings[dataDirKey]
        if (settings[templateKey]) template = settings[templateKey]
        if (settings[openEditorKey]) openEditor = settings[openEditorKey]
        if (settings[editorKey]) editor = settings[editorKey]
        if (settings[dirFormatKey]) dirFormat = settings[dirFormatKey]
        if (settings[filetypeKey]) filetype = settings[filetypeKey]
        if (settings[permissionKey]) requestPermission = settings[permissionKey]
        if (settings[statsKey]) stats = settings[statsKey]
        if (settings[debugKey]) DEBUG = settings[debugKey]
    } catch (err) {
        console.log(`Problem reading from config file: ${err.message}`)
    }

    return settings
}

function readTemplateFile() {
    // attempt to read the template file
    try {
        // and return its contents if it exists...
        return fs.readFileSync(journalTemplateFile, 'utf8')
    } catch (err) {
        // config file doesn't exist, continue...
        // else return an empty string as the template.
        if (DEBUG) console.log(`No template file. Using default empty file. [OK]`)
        return ''
    }
}

/**
 * Create a journal data directory for the current year and month if it doesn't exist.
 */
function createJournalDir() {
    const [month, date, year] = currentDateParts()
    const currentDateDir = `${dataDir}/${year}/${month.padStart(2, '0')}`
    if (DEBUG) console.log(`Current date dir = ${currentDateDir}`)
    if (fs.existsSync(currentDateDir)) {
        //   if exists, return it
        return currentDateDir
    } else {
        //   else create all directories using directory format in data directory
        //   return new directory
        const createdDir = fs.mkdirSync(currentDateDir, { recursive: true });
        if (DEBUG) console.log(`Created dir = ${createdDir}`)
        return createdDir
    }
}

// create new journal entry
function createJournalFileWithTemplate(template) {
  const [month, date, year] = currentDateParts();
  const currentDateFile = `${dataDir}/${year}/${month.padStart(
    2,
    '0'
  )}/${date.padStart(2, '0')}.${filetype}`;
  if (DEBUG) console.log(`Current date file = ${currentDateFile}`);
  // TODO: replace template tokens (ex: {{DATE}} with today's date
  // see if the journal entry exists
  if (fs.existsSync(currentDateFile)) {
    //   if exists, return it
    return currentDateFile;
  } else {
    //   else using the current journal format and filetype, create the new file
    //   return new file
    fs.appendFileSync(currentDateFile, template);
    if (DEBUG) console.log(`Created file = ${currentDateFile}`);
    return currentDateFile;
  }
}

// open file with default editor
function openJournalWithEditor(journal, editor) {
  if (DEBUG) console.log(`Open ${journal} with ${editor}`);
  // TODO Fix spawning journal with terminal editors...
  const stream = spawn(`${editor}`, [`${journal}`]);
  stream.on('close', (code) => {
    console.log(`editor child process exited with code ${code}`);
  });
}

function currentDateParts() {
    const currentDate = new Date()
    return [month, date, year] = currentDate.toLocaleDateString().split("/")
}

