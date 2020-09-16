//
// This module will provide the ability to read and write key-value pairs to/from a file.
//

const fs = require('fs')

/**
 * Reads a file and constructs an object with key/value pairs.
 * @param {string} filename 
 * @returns {any} A dictionary with key/value pairs.
 */
exports.readFromFile = function readFromFile(filename) {
    try {
        const contents = fs.readFileSync(filename, 'utf8')
        // contents now contains the contents of the file as a string. This string is key/value pairs.
        // We need to parse the string and populate an object to return to the caller.
        const lines = contents.split('\n')
        const dictionary = {}
        lines.forEach((line) => {
            const pair = line.split('=')
            if (pair.length >= 2) {
                const key = pair[0].trim()
                const value = pair[1].trim()
                dictionary[key] = value
            }
        })

        return dictionary
    } catch (err) {
        throw err
    }
}


exports.saveToFile = function saveToFile(object, filename) {
    // TODO: implement this to save an object to file as key/value pairs
}
