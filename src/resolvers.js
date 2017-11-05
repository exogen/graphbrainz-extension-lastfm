import countryList from 'country-list'
import dateFormat from 'dateformat'
import { connectionFromArraySlice, getOffsetWithDefault } from 'graphql-relay'

const debug = require('debug')('graphbrainz-extension-lastfm/resolvers')

const countries = countryList()

function resolveImage(entity, args) {
  let dataSource = entity.image ? entity : entity.fetchInfo()
  return Promise.resolve(dataSource).then(data => {
    const images = data.image
    if (!images || !images.length) {
      return null
    }
    // Default to the last image.
    let image = images[images.length - 1]
    if (args.size) {
      const size = args.size.toLowerCase()
      image = images.find(image => image.size === size)
    }
    return image ? image['#text'] : null
  })
}

function resolveListenerCount(entity) {
  let dataSource
  if (entity.listeners != null) {
    dataSource = entity
  } else if (entity.stats) {
    dataSource = entity.stats
  } else {
    dataSource = entity.fetchInfo()
  }
  return Promise.resolve(dataSource)
    .then(data => data.stats || data)
    .then(data => data.listeners)
}

function resolvePlayCount(entity) {
  let dataSource
  if (entity.playcount != null) {
    dataSource = entity
  } else if (entity.stats) {
    dataSource = entity.stats
  } else {
    dataSource = entity.fetchInfo()
  }
  return Promise.resolve(dataSource)
    .then(data => data.stats || data)
    .then(data => data.playcount)
}

function createWikiResolver(fieldName = 'wiki') {
  return function resolveWiki(entity, args, context) {
    // The entity might already have a `wiki` or `bio` attribute, but there's
    // no way for us to tell which language was fetched. So ensure we fetch with
    // the requested language here. It might already be cached anyway!
    const params = {}
    if (args.lang) {
      params.lang = args.lang.toLowerCase()
    }
    return entity.fetchInfo(params).then(data => {
      const wiki = data[fieldName]
      if (wiki) {
        const link = wiki.links && wiki.links.link
        const [publishDate, publishTime] = wiki.published
          ? dateFormat(wiki.published, 'yyyy-mm-dd HH:MM').split(' ', 2)
          : [null, null]
        return {
          publishDate,
          publishTime,
          summaryHTML: wiki.summary,
          contentHTML: wiki.content,
          url: link ? link.href : null
        }
      }
      return null
    })
  }
}

function createTopTagsResolver(method) {
  return function resolveTopTags(entity, args, context) {
    // For some reason, `track.getTopTags` doesn't support MBID lookups but the
    // others do?!
    const params =
      method === 'trackTopTags'
        ? entity.fetchByNameParams()
        : entity.fetchParams()
    if (!params) {
      return null
    }
    return context.loaders.lastFM
      .load([method, params])
      .then(createConnectionResolver('tag', args))
      .then(connection => {
        connection.edges.forEach(edge => {
          edge.tagCount = edge.node.count
        })
        return connection
      })
  }
}

function createConnectionResolver(fieldName, args) {
  return function resolveConnection(data) {
    const array = data[fieldName]
    let meta = { sliceStart: 0, arrayLength: array.length }
    if (array.length) {
      const attrs = data['@attr']
      if (attrs.page) {
        const page = parseInt(attrs.page, 10)
        const perPage = parseInt(attrs.perPage, 10)
        const arrayLength = parseInt(attrs.total, 10)
        const sliceStart = (page - 1) * perPage
        meta = { sliceStart, arrayLength }
      }
    }
    const connection = connectionFromArraySlice(array, args, meta)
    connection.nodes = connection.edges.map(edge => edge.node)
    connection.totalCount = meta.arrayLength
    return connection
  }
}

export default {
  LastFMTag: {},
  LastFMArtist: {
    mbid: artist => artist.mbid || null,
    name: artist => artist.name || null,
    image: resolveImage,
    listenerCount: resolveListenerCount,
    playCount: resolvePlayCount,
    biography: createWikiResolver('bio'),
    topAlbums: (artist, args, context) => {
      const params = artist.fetchParams()
      if (!params) {
        return null
      }
      return context.loaders.lastFM
        .load(['artistTopAlbums', params])
        .then(createConnectionResolver('album', args))
    },
    topTags: createTopTagsResolver('artistTopTags'),
    topTracks: (artist, args, context) => {
      const params = artist.fetchParams()
      if (!params) {
        return null
      }
      return context.loaders.lastFM
        .load(['artistTopTracks', params])
        .then(createConnectionResolver('track', args))
    },
    similarArtists: (artist, args, context) => {
      const params = artist.fetchParams()
      if (!params) {
        return null
      }
      return context.loaders.lastFM
        .load(['similarArtists', params])
        .then(createConnectionResolver('artist', args))
    }
  },
  LastFMAlbum: {
    mbid: album => album.mbid || null,
    title: album => album.name || null,
    image: resolveImage,
    listenerCount: resolveListenerCount,
    playCount: resolvePlayCount,
    description: createWikiResolver(),
    artist: album => {
      const { artist } = album
      if (artist && artist.fetchAll) {
        return artist.fetchInfo()
      }
      return artist
    },
    topTags: createTopTagsResolver('albumTopTags')
  },
  LastFMTrack: {
    mbid: track => track.mbid || null,
    title: track => track.name || null,
    duration: (track, args, context) => {
      // When tracks are returned from endpoints other than `track.getInfo`,
      // they often have a duration of 0 or use seconds instead of milliseconds.
      // So ensure that we only read durations from the `track.getInfo` endpoint.
      const dataSource =
        track.fetchMethod === 'trackInfo' ? track : track.fetchInfo()
      return Promise.resolve(dataSource).then(data => data.duration)
    },
    listenerCount: resolveListenerCount,
    playCount: resolvePlayCount,
    description: createWikiResolver(),
    artist: track => track.artist,
    album: track => {
      if (track.album) {
        return track.album
      } else if (track.fetchMethod !== 'trackInfo') {
        return track.fetchInfo().then(data => data.album)
      }
      return null
    },
    similarTracks: (track, args, context) => {
      const params = track.fetchParams()
      if (!params) {
        return null
      }
      return context.loaders.lastFM
        .load(['similarTracks', params])
        .then(createConnectionResolver('track', args))
    },
    topTags: createTopTagsResolver('trackTopTags')
  },
  LastFMCountry: {
    topArtists: (country, args, context) => {
      const countryName = country.isoName || country.areaName
      const params = { country: countryName }
      return context.loaders.lastFM
        .load(['geoTopArtists', params])
        .then(createConnectionResolver('artist', args))
    },
    topTracks: (country, args, context) => {
      const countryName = country.isoName || country.areaName
      const params = { country: countryName }
      return context.loaders.lastFM
        .load(['geoTopTracks', params])
        .then(createConnectionResolver('track', args))
    }
  },
  LastFMArtistEdge: {
    matchScore: edge => edge.node.match
  },
  LastFMTrackEdge: {
    matchScore: edge => edge.node.match
  },
  LastFMChartQuery: {
    topArtists: (root, args, context) => {
      let method = 'chartTopArtists'
      let params = {}
      if (args.country) {
        // Fall back to using the actual argument value as the country name,
        // even though we tell users it should be the two-letter code.
        const countryName = countries.getName(args.country) || args.country
        method = 'geoTopArtists'
        params.country = countryName
      }
      return context.loaders.lastFM
        .load([method, params])
        .then(createConnectionResolver('artist', args))
    },
    topTags: (root, args, context) => {
      const params = {}
      return context.loaders.lastFM
        .load(['chartTopTags', params])
        .then(createConnectionResolver('tag', args))
    },
    topTracks: (root, args, context) => {
      let method = 'chartTopTracks'
      let params = {}
      if (args.country) {
        // Fall back to using the actual argument value as the country name,
        // even though we tell users it should be the two-letter code.
        const countryName = countries.getName(args.country) || args.country
        method = 'geoTopTracks'
        params.country = countryName
      }
      return context.loaders.lastFM
        .load([method, params])
        .then(createConnectionResolver('track', args))
    }
  },
  LastFMQuery: {
    chart: () => ({})
  },
  Area: {
    lastFM: (area, args, context) => {
      if (area.type === 'Country') {
        const isoCodes = area['iso-3166-1-codes'] || []
        if (isoCodes.length) {
          const isoCode = isoCodes[0].toLowerCase()
          const isoName = (isoCode && countries.getName(isoCode)) || null
          return {
            areaName: area.name,
            isoCode,
            isoName
          }
        }
      }
      return null
    }
  },
  Artist: {
    lastFM: (artist, args, context) => {
      return context.loaders.lastFM.load(['artistInfo', { mbid: artist.id }])
    }
  },
  Recording: {
    lastFM: (recording, args, context) => {
      return context.loaders.lastFM.load(['trackInfo', { mbid: recording.id }])
    }
  },
  Release: {
    lastFM: (release, args, context) => {
      return context.loaders.lastFM.load(['albumInfo', { mbid: release.id }])
    }
  },
  Query: {
    lastFM: () => ({})
  }
}
