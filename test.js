const typoMapPromise = require('.')

{
  typoMapPromise({
    type: 'typoToWord',
    sortBy: 'alphabetical',
  })
    .then(map => {
      console.log('Typo to Word:')
      const keysHead = Object
        .keys(map)
        .slice(0, 10)
      keysHead.forEach(key =>
        console.log(key, '\t=>\t', map[key])
      )
      console.log('\n')
    })
    .catch(console.error)
}

{
  typoMapPromise({
    type: 'wordToTypos',
    sortBy: 'alphabetical',
  })
    .then(map => {
      console.log('Word to Typo:')
      const keysHead = Object
        .keys(map)
        .slice(0, 10)
      keysHead.forEach(key =>
        console.log(key, '\t=>\t', map[key])
      )
    })
    .catch(console.error)
}
