#!/usr/local/bin/env node
// Leaving the above script notation for now. I don't think I want to invoke that way but
// I'm going to leave it here for reference.

// TODO: This script will not currently work in DOS/WIN based environments.

// imports
const fs = require('fs')
const path = require('path')

// define the initial settings for this script
const configDir = process.env.XDG_CONFIG_HOME || normalizeHomeDir('.config')
const scriptConfigDir = `${configDir}/journal`
const scriptConfigFile = `${scriptConfigDir}/config`

let DEBUG = true

let dataDir = normalizeHomeDir('Developer/Personal/journal')
let dirFormat = 'yyyy/mm'
let filetype = 'md'
let editor = process.env.EDITOR || 'code'
let requestPermission = false
let stats = false

logSettings()

// read config file. If it exists, it overrides the settings above.
//  - read directory format (yyyy/mm vs yy-mm vs ??)
//  - read file type
//  - read template name
//  - read template file
//  - read editor

readConfigFile()
readTemplateFile()

// parse command line args. If they exist, they override everything above.
//  possible args:
//      --editor=(editor executable name)
//      --filetype=(file extension)
//      --preview (explicitly state what script will do but don't do it)
//      --stats (print stats for consecutive days, percent of TODOs complete, etc.)

readCommandLineArgs(process.argv)

// switch to journal directory (create if necessary)
const dir = createJournalDir()

// create new journal entry
const journal = createJournalFileWithTemplate()

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

        console.log(`EDITOR = ${editor}`)

        console.log(`REQUEST PERMISSIONS = ${requestPermission}`)
        console.log(`SHOW STATS = ${stats}`)
    }
}

function readConfigFile() {
    try {
        const config = fs.readFileSync(scriptConfigFile, 'utf8')
        if (DEBUG) console.log(config)
        // TODO: update global settings accordingly
    } catch (err) {
        // config file doesn't exist, continue...
        if (DEBUG) console.log(`No configuration file. Using default settings. [OK]`)
    }
}

function readTemplateFile() {
    // TODO: if the template file specified in the config file exists, return its contents
    // else return an empty string as the template.
    return ''
}

function readCommandLineArgs(argv) {
    // TODO: using yargs, parse the command line arguments and update global settings accordingly.
}

/**
 * Create a journal data directory for the current year and month if it doesn't exist.
 */
function createJournalDir() {
    const currentDate = new Date()
    const [month, date, year] = currentDate.toLocaleDateString().split("/")
    const currentDateDir = `${dataDir}/${year}/${month.padStart(2, '0')}`
    if (DEBUG) console.log(`Current date dir = ${currentDateDir}`)
    if (fs.existsSync(currentDateDir)) {
        //   if exists, return it
        return currentDateDir
    } else {
        //   else create all directories using directory format in data directory
        //   return new directory
        const createdDir = fs.mkdirSync(currentDateDir)
        if (DEBUG) console.log(`Created dir = ${createdDir}`)
        return createdDir
    }
}

// create new journal entry
function createJournalFileWithTemplate() {
    // TODO: see if the journal entry exists
    //      if exists, return it
    //      else using the current journal format and filetype, create the new file
    //      and return it
}

// open file with default editor
function openJournalWithEditor(journal, editor) {
    // TODO: open the journal file with the editor of choice
}
