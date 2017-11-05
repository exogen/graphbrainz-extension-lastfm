import test from 'ava'
import { graphql } from 'graphql'
import MusicBrainz from 'graphbrainz/lib/api'
import baseSchema, { createSchema } from 'graphbrainz/lib/schema'
import { createContext } from 'graphbrainz/lib/context'
import extension from './index'

const client = new MusicBrainz()
const options = { client, extensions: [extension] }
const schema = createSchema(baseSchema, options)
const context = createContext(options)

function testQuerySnapshot(t, query) {
  return graphql(schema, query, null, context).then(
    result => t.snapshot(result),
    err => t.snapshot(err)
  )
}

test('lastFM queries fail if there is no API key configured', t => {
  const context = createContext({ ...options, lastFM: { apiKey: null } })
  return graphql(
    schema,
    `
      {
        lookup {
          artist(mbid: "5b11f4ce-a62d-471e-81fc-a69a8278c7da") {
            lastFM {
              image
              listenerCount
              playCount
            }
          }
        }
      }
    `,
    null,
    context
  ).then(result => t.snapshot(result), err => t.snapshot(err))
})

test(
  'lastFM chart queries are available from the root query',
  testQuerySnapshot,
  `
  {
    lastFM {
      chart {
        topArtists(first: 5) {
          totalCount
          nodes {
            mbid
            name
            url
          }
        }
        topTracks(first: 5) {
          totalCount
          nodes {
            mbid
            title
            url
          }
        }
      }
    }
  }
`
)
