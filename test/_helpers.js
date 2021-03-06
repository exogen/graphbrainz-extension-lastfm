import { graphql } from 'graphql'
import MusicBrainz from 'graphbrainz/lib/api'
import baseSchema, { createSchema } from 'graphbrainz/lib/schema'
import { createContext } from 'graphbrainz/lib/context'
import extension from '../src'

const NOCK_MODE = process.env.NOCK_MODE || 'play'
const rateLimit = NOCK_MODE === 'play' ? { limit: Infinity, period: 0 } : {}
const client = new MusicBrainz({ ...rateLimit })
export const options = {
  client,
  lastFM: { ...rateLimit },
  extensions: [extension]
}
export const schema = createSchema(baseSchema, options)
export const context = createContext(options)

export function runQuery(query, variables) {
  return graphql(schema, query, null, context, variables)
}

export function testQuerySnapshot(t, query, variables) {
  return runQuery(query, variables).then(
    result => t.snapshot(result),
    err => t.snapshot(err)
  )
}
