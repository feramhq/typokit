const path = require('path')
const fsp = require('fs-promise')
const yaml = require('js-yaml')
const values = require('object.values')
const nativeConsole = require('console')
const log = new nativeConsole.Console(process.stdout, process.stderr)
const typoMapsPath = path.join(__dirname, 'maps')

function reverseMap (valueToKeysMap) {
  const keyToValueMap = {}

  Object
    .keys(valueToKeysMap)
    .forEach(value => {
      let keys = valueToKeysMap[value]

      if (!Array.isArray(keys)) {
        keys = [keys]
      }
      keys.forEach(key =>
        keyToValueMap[key] = value
      )
    })

  return keyToValueMap
}

module.exports = (options = {}) => {
  const {type} = options

  return fsp
    .readdir(typoMapsPath)
    .then(fileNames => fileNames
      .filter(name => /\.yaml$/.test(name))
      .map(name => path.join(typoMapsPath, name))
    )
    .then(filePaths => Promise.all(
      filePaths.map(filePath => fsp.readFile(filePath))
    ))
    .then(fileContents => fileContents.map(yaml.safeLoad))
    .then(typoMaps => {

      if (type === 'words') {
        return typoMaps.reduce(
          (words, typoMap) => words.concat(Object.keys(typoMap)),
          []
        )
      }
      else if (type === 'typos') {
        return typoMaps.reduce(
          (typos, typoMap) => typos.concat(...values(typoMap)),
          []
        )
      }
      else  if (type === 'wordToTypos') {
        return typoMaps.reduce(
          (map, typoMap) => Object.assign(map, typoMap),
          {}
        )
      }
      else if (type === 'typoToWord') {
        return reverseMap(typoMaps.reduce(
          (map, typoMap) => Object.assign(map, typoMap),
          {}
        ))
      }
      else {
        throw new Error(`"${type}" is no valid type`)
      }
    })
    // .then(typoToWordMap => {
    //   fileTypeObject.map = typoToWordMap
    //   return fileTypeObject
    // })
    .catch(error => log.error(error))
}
