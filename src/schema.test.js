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

test(
  'fields available only in getInfo queries are available in connections',
  testQuerySnapshot,
  `
    {
      lastFM {
        chart {
          topTracks(first: 5) {
            nodes {
              mbid
              title
              artist {
                mbid
                name
                url
                image
                topTags(first: 5) {
                  nodes {
                    name
                  }
                }
                topTracks(first: 5) {
                  nodes {
                    title
                  }
                }
              }
              album {
                mbid
                title
                url
                image
                artist {
                  mbid
                  name
                  url
                  image
                }
              }
            }
          }
        }
      }
    }
  `
)

test(
  'MusicBrainz artists has a lastFM artist field',
  testQuerySnapshot,
  `
  {
    lookup {
      artist(mbid: "5b11f4ce-a62d-471e-81fc-a69a8278c7da") {
        lastFM {
          mbid
          name
          url
          image
          imageSmall: image(size: SMALL)
          imageMedium: image(size: MEDIUM)
          imageLarge: image(size: LARGE)
          imageExtraLarge: image(size: EXTRALARGE)
          imageMega: image(size: MEGA)
          listenerCount
          playCount
          biography {
            summaryHTML
            contentHTML
            publishDate
            publishTime
            url
          }
          biographyFR: biography(lang: "fr") {
            summaryHTML
            contentHTML
            publishDate
            publishTime
            url
          }
          topTags(first: 5) {
            nodes {
              name
              url
            }
          }
          topTracks(first: 5) {
            nodes {
              title
              url
            }
          }
          topAlbums(first: 5) {
            nodes {
              title
              url
            }
          }
        }
      }
    }
  }
`
)

test(
  'areas that are countries can retrieve top artists and tracks',
  testQuerySnapshot,
  `
  {
    search {
      areas(query: "Germany", first: 1) {
        nodes {
          name
          type
          lastFM {
            topArtists(first: 5) {
              nodes {
                name
                listenerCount
                playCount
              }
            }
            topTracks(first: 5) {
              nodes {
                title
                listenerCount
                playCount
                artist {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`
)

test(
  'countries that are not tracked by Last.fm have empty chart data',
  testQuerySnapshot,
  `
  {
    search {
      areas(query: "East Germany", first: 1) {
        nodes {
          name
          type
          lastFM {
            topArtists(first: 5) {
              nodes {
                name
                listenerCount
                playCount
              }
            }
            topTracks(first: 5) {
              nodes {
                title
                listenerCount
                playCount
                artist {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`
)

test(
  'areas that are not countries have a null lastFM field',
  testQuerySnapshot,
  `
  {
    search {
      areas(query: "New York", first: 1) {
        nodes {
          name
          type
          lastFM {
            topArtists(first: 5) {
              nodes {
                name
                listenerCount
                playCount
              }
            }
            topTracks(first: 5) {
              nodes {
                title
                listenerCount
                playCount
                artist {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`
)
