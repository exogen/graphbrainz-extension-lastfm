import fs from 'fs'
import glob from 'glob'

glob.sync('test/fixtures/**/*.json').forEach(filename => {
  const fixture = JSON.parse(fs.readFileSync(filename, 'utf8'))
  const { queries } = fixture
  if (queries && queries.api_key && queries.api_key !== '*') {
    queries.api_key = '*'
    const output = JSON.stringify(fixture, null, 2) + '\n'
    fs.writeFileSync(filename, output, 'utf8')
  }
})
