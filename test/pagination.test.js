import test from 'ava'
import { setupTests } from 'ava-nock'
import { runQuery } from './_helpers'

setupTests()

test('`first` argument must be 0-100 and non-null', t => {
  const query = `
    query TopArtists($first: Int) {
      lastFM {
        chart {
          topArtists(first: $first) {
            totalCount
          }
        }
      }
    }
  `
  return Promise.all([
    runQuery(query, { first: null }),
    runQuery(query, { first: -1 }),
    runQuery(query, { first: 0 }),
    runQuery(query, { first: 100 }),
    runQuery(query, { first: 101 })
  ]).then(results => {
    t.snapshot(
      results.map(result => {
        return result.errors ? result.errors.map(err => err.message) : []
      })
    )
  })
})

test('similarArtists pagination', t => {
  const query = `
    query SimilarArtists($first: Int, $after: String) {
      search {
        artists(query: "Tom Petty", first: 1) {
          nodes {
            lastFM {
              similarArtists(first: $first, after: $after) {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
                edges {
                  matchScore
                  cursor
                  node {
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
  const seenArtists = new Map()
  let lastEdge
  return runQuery(query, { first: 50 })
    .then(result => {
      const artist = result.data.search.artists.nodes[0]
      const { pageInfo, edges } = artist.lastFM.similarArtists
      t.true(pageInfo.hasNextPage)
      t.false(pageInfo.hasPreviousPage)
      t.is(edges.length, 50)
      edges.forEach(edge => {
        t.false(seenArtists.has(edge.node.name))
        seenArtists.set(edge.node.name, edge.matchScore)
        lastEdge = edge
      })
      return runQuery(query, { first: 50, after: edges[49].cursor })
    })
    .then(result => {
      const artist = result.data.search.artists.nodes[0]
      const { pageInfo, edges } = artist.lastFM.similarArtists
      t.true(pageInfo.hasNextPage)
      // See: https://github.com/graphql/graphql-relay-js/issues/58 :(
      t.false(pageInfo.hasPreviousPage)
      t.is(edges.length, 50)
      edges.forEach(edge => {
        t.false(seenArtists.has(edge.node.name))
        t.true(edge.matchScore < lastEdge.matchScore)
        seenArtists.set(edge.node.name, edge.matchScore)
        lastEdge = edge
      })
      return runQuery(query, { first: 50, after: edges[49].cursor })
    })
    .then(result => {
      const artist = result.data.search.artists.nodes[0]
      const { pageInfo, edges } = artist.lastFM.similarArtists
      t.true(pageInfo.hasNextPage)
      t.false(pageInfo.hasPreviousPage)
      t.is(edges.length, 50)
      edges.forEach(edge => {
        t.false(seenArtists.has(edge.node.name))
        t.true(edge.matchScore < lastEdge.matchScore)
        seenArtists.set(edge.node.name, edge.matchScore)
        lastEdge = edge
      })
      return runQuery(query, { first: 50, after: edges[49].cursor })
    })
    .then(result => {
      const artist = result.data.search.artists.nodes[0]
      const { pageInfo, edges } = artist.lastFM.similarArtists
      t.true(pageInfo.hasNextPage)
      t.false(pageInfo.hasPreviousPage)
      t.is(edges.length, 50)
      edges.forEach(edge => {
        t.false(seenArtists.has(edge.node.name))
        t.true(edge.matchScore < lastEdge.matchScore)
        seenArtists.set(edge.node.name, edge.matchScore)
        lastEdge = edge
      })
      return runQuery(query, { first: 50, after: edges[49].cursor })
    })
    .then(result => {
      const artist = result.data.search.artists.nodes[0]
      const { pageInfo, edges } = artist.lastFM.similarArtists
      t.false(pageInfo.hasNextPage)
      t.false(pageInfo.hasPreviousPage)
      t.is(edges.length, 50)
      edges.forEach(edge => {
        t.false(seenArtists.has(edge.node.name))
        t.true(edge.matchScore < lastEdge.matchScore)
        seenArtists.set(edge.node.name, edge.matchScore)
        lastEdge = edge
      })
      return runQuery(query, { first: 50, after: edges[49].cursor })
    })
    .then(result => {
      const artist = result.data.search.artists.nodes[0]
      const { pageInfo, edges } = artist.lastFM.similarArtists
      t.false(pageInfo.hasNextPage)
      t.false(pageInfo.hasPreviousPage)
      t.is(edges.length, 0)
    })
})

test('topArtists pagination', t => {
  const query = `
    query SimilarArtists($first: Int, $after: String) {
      lastFM {
        chart {
          topArtists(first: $first, after: $after) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              cursor
              node {
                name
              }
            }
            totalCount
          }
        }
      }
    }
  `
  let prevArtists
  return runQuery(query, { first: 6 })
    .then(result => {
      const artists = result.data.lastFM.chart.topArtists
      t.is(artists.edges.length, 6)
      t.snapshot(artists)
      prevArtists = artists
      return runQuery(query, { first: 6, after: prevArtists.edges[2].cursor })
    })
    .then(result => {
      const artists = result.data.lastFM.chart.topArtists
      t.is(artists.edges.length, 6)
      t.deepEqual(artists.edges.slice(0, 3), prevArtists.edges.slice(3))
      t.snapshot(artists)
    })
})
