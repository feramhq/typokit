const path = require('path')
const fsp = require('fs-promise')
const yaml = require('js-yaml')
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
  const {type, sortBy} = options

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

      if (type === 'wordToTypos') {
        return typoMaps.reduce(
          (map, typoMap) => Object.assign(map, typoMap),
          {}
        )
      }

      return reverseMap(typoMaps.reduce(
        (map, typoMap) => Object.assign(map, typoMap),
        {}
      ))
    })
    // .then(typoToWordMap => {
    //   fileTypeObject.map = typoToWordMap
    //   return fileTypeObject
    // })
    .catch(error => log.error(error))
}
