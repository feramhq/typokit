const path = require('path')
const fsp = require('fs-promise')
const yaml = require('js-yaml')
const values = require('object.values')
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

function getTypoMapsPromise () {
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
}

module.exports = {
  get wordsPromise () {
    return getTypoMapsPromise().then(typoMaps =>
      typoMaps.reduce(
        (words, typoMap) => words.concat(Object.keys(typoMap)),
        []
      )
    )
  },

  get typosPromise () {
    return getTypoMapsPromise().then(typoMaps =>
      typoMaps.reduce(
        (typos, typoMap) => typos.concat(...values(typoMap)),
        []
      )
    )
  },

  get typoToWordPromise () {
    return getTypoMapsPromise().then(typoMaps =>
      reverseMap(typoMaps.reduce(
        (map, typoMap) => Object.assign(map, typoMap),
        {}
      ))
    )
  },

  get wordToTyposPromise () {
    return getTypoMapsPromise().then(typoMaps =>
      typoMaps.reduce(
        (map, typoMap) => Object.assign(map, typoMap),
        {}
      )
    )
  },
}
