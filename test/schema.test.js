import test from 'ava'
import { graphql } from 'graphql'
import { setupTests } from 'ava-nock'
import { createContext } from 'graphbrainz/lib/context'
import { options, schema, testQuerySnapshot } from './_helpers'

setupTests()

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
  'MusicBrainz artists have a lastFM artist field',
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
          similarArtists(first: 5) {
            edges {
              matchScore
              node {
                mbid
                name
                topTracks(first: 1) {
                  nodes {
                    title
                  }
                }
              }
            }
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
  'MusicBrainz recordings have a lastFM field',
  testQuerySnapshot,
  `
  {
    lookup {
      recording(mbid: "9f9cf187-d6f9-437f-9d98-d59cdbd52757") {
        title
        lastFM {
          mbid
          title
          url
          duration
          listenerCount
          playCount
          description {
            summaryHTML
            contentHTML
            publishDate
            publishTime
            url
          }
          descriptionES: description(lang: "es") {
            summaryHTML
            contentHTML
            publishDate
            publishTime
            url
          }
          artist {
            mbid
            name
          }
          album {
            mbid
            title
          }
          similarTracks(first: 5) {
            edges {
              matchScore
              node {
                mbid
                title
                url
              }
            }
          }
          topTags(first: 5) {
            edges {
              tagCount
              node {
                name
                url
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
  'MusicBrainz releases have a lastFM field',
  testQuerySnapshot,
  `
  {
    lookup {
      release(mbid: "b84ee12a-09ef-421b-82de-0441a926375b") {
        title
        lastFM {
          mbid
          title
          url
          image
          image
          imageSmall: image(size: SMALL)
          imageMedium: image(size: MEDIUM)
          imageLarge: image(size: LARGE)
          imageExtraLarge: image(size: EXTRALARGE)
          imageMega: image(size: MEGA)
          listenerCount
          playCount
          description {
            summaryHTML
            contentHTML
            publishDate
            publishTime
            url
          }
          descriptionFR: description(lang: "fr") {
            summaryHTML
            contentHTML
            publishDate
            publishTime
            url
          }
          artist {
            name
            mbid
          }
          topTags(first: 5) {
            nodes {
              name
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

test(
  'chart topTracks can be queried globally and by country',
  testQuerySnapshot,
  `
  {
    lastFM {
      chart {
        topArtists(first: 5) {
          nodes {
            name
          }
        }
        topArtistsJP: topArtists(country: "JP", first: 5) {
          nodes {
            name
          }
        }
        topArtistsGB: topArtists(country: "GB", first: 5) {
          nodes {
            name
          }
        }
      }
    }
  }
`
)

test(
  'chart topArtists can be queried globally and by country',
  testQuerySnapshot,
  `
  {
    lastFM {
      chart {
        topTracks(first: 5) {
          nodes {
            title
          }
        }
        topTracksJP: topTracks(country: "JP", first: 5) {
          nodes {
            title
          }
        }
        topTracksGB: topTracks(country: "GB", first: 5) {
          nodes {
            title
          }
        }
      }
    }
  }
`
)

test(
  'chart topTags can be queried globally',
  testQuerySnapshot,
  `
  {
    lastFM {
      chart {
        topTags(first: 5) {
          nodes {
            name
          }
        }
      }
    }
  }
`
)

test(
  'lastFM field is null if the artist MBID is not on Last.fm',
  testQuerySnapshot,
  `
  {
    search {
      artists(query: "Cohen", first: 3) {
        nodes {
          lastFM {
            mbid
          }
        }
      }
    }
  }
  `
)

test(
  'lastFM field is null if the recording MBID is not on Last.fm',
  testQuerySnapshot,
  `
  {
    search {
      recordings(query: "Honey Lips", first: 3) {
        nodes {
          lastFM {
            mbid
          }
        }
      }
    }
  }
  `
)

test(
  'lastFM field is null if the release MBID is not on Last.fm',
  testQuerySnapshot,
  `
  {
    search {
      releases(query: "Vacant", first: 3) {
        nodes {
          lastFM {
            mbid
          }
        }
      }
    }
  }
  `
)
