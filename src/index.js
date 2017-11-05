import schema from './schema'
import resolvers from './resolvers'
import createLoader from './loader'
import LastFMClient from './client'
import { ONE_DAY } from 'graphbrainz/lib/util'

export default {
  name: 'Last.fm',
  description: `Retrieve artist, release, and recording information from
[Last.fm](https://www.last.fm/).`,
  extendContext(context, { lastFM = {} } = {}) {
    const client = new LastFMClient(lastFM)
    const cacheSize = parseInt(
      process.env.LASTFM_CACHE_SIZE ||
        process.env.GRAPHBRAINZ_CACHE_SIZE ||
        8192,
      10
    )
    const cacheTTL = parseInt(
      process.env.LASTFM_CACHE_TTL ||
        process.env.GRAPHBRAINZ_CACHE_TTL ||
        ONE_DAY,
      10
    )
    return {
      ...context,
      loaders: {
        ...context.loaders,
        lastFM: createLoader({ client, cacheSize, cacheTTL })
      }
    }
  },
  extendSchema: {
    schemas: [schema],
    resolvers
  }
}
