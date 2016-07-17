const typoMapPromise = require('.')
const assert = require('assert')
const values = require('object.values')
const numberOfWords = 3219
const numberOfTypos = 4526

{
  typoMapPromise({type: 'words'})
    .then(words => {
      assert(Array.isArray(words))
      assert.equal(words.length, numberOfWords)
      assert(words
        .slice(0, 10)
        .every(word => /^a/.test(word))
      )
    })
    .catch(console.error)
}

{
  typoMapPromise({type: 'typos'})
    .then(typos => {
      assert(Array.isArray(typos))
      assert.equal(typos.length, numberOfTypos)
      assert(typos
        .slice(0, 10)
        .every(typo => /^a/.test(typo))
      )
    })
    .catch(console.error)
}

{
  typoMapPromise({type: 'typoToWord'})
    .then(map => {
      const keys = Object.keys(map)
      assert.equal(keys.length, numberOfTypos)
      assert(values(map).every(value => typeof value === 'string'))
    })
    .catch(console.error)
}

{
  typoMapPromise({type: 'wordToTypos'})
    .then(map => {
      const keys = Object.keys(map)
      assert.equal(keys.length, numberOfWords)
      assert(values(map).every(value =>
        typeof value === 'string' || Array.isArray(value)
      ))
    })
    .catch(console.error)
}
