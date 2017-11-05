import qs from 'qs'
import DataLoader from 'dataloader'
import LRUCache from 'lru-cache'

const debug = require('debug')('graphbrainz:extensions/last-fm')

export default function createLoader(options) {
  const { client } = options
  const cache = LRUCache({
    max: options.cacheSize,
    maxAge: options.cacheTTL,
    dispose(key) {
      debug(`Removed from cache. key=${key}`)
    }
  })
  // Make the cache Map-like.
  cache.delete = cache.del
  cache.clear = cache.reset

  const createArtist = (artist, method) => {
    if (typeof artist === 'string') {
      artist = {
        name: artist,
        fetchAll: true
      }
    }
    return {
      ...artist,
      fetchMethod: method,
      fetchParams() {
        return this.mbid ? { mbid: this.mbid } : this.fetchByNameParams()
      },
      fetchByNameParams() {
        if (this.name) {
          return { artist: this.name }
        }
      },
      fetchInfo(params) {
        const fetchParams = this.fetchParams()
        if (fetchParams) {
          const key = ['artistInfo', { ...params, ...fetchParams }]
          return loader.load(key)
        }
        return Promise.resolve(this)
      }
    }
  }

  const createAlbum = (album, method, trackArtist) => {
    let artist = album.artist || null
    if (trackArtist && artist === trackArtist.name) {
      artist = trackArtist
    } else if (artist) {
      artist = createArtist(artist, method)
    }
    return {
      ...album,
      // Some endpoints return albums with a `name` property, others call it
      // `title`, so just make both available.
      name: album.name || album.title,
      title: album.title || album.name,
      artist: artist,
      fetchMethod: method,
      fetchParams() {
        return this.mbid ? { mbid: this.mbid } : this.fetchByNameParams()
      },
      fetchByNameParams() {
        if (this.name && this.artist) {
          if (typeof this.artist === 'string') {
            return { album: this.name, artist: this.artist }
          } else if (this.artist.name) {
            return { album: this.name, artist: this.artist.name }
          }
        }
      },
      fetchInfo(params) {
        const fetchParams = this.fetchParams()
        if (fetchParams) {
          const key = ['albumInfo', { ...params, ...fetchParams }]
          return loader.load(key)
        }
        return Promise.resolve(this)
      }
    }
  }

  const createTrack = (track, method) => {
    const artist = track.artist ? createArtist(track.artist, method) : null
    return {
      ...track,
      artist,
      album: track.album ? createAlbum(track.album, method, artist) : null,
      fetchMethod: method,
      fetchParams() {
        return this.mbid ? { mbid: this.mbid } : this.fetchByNameParams()
      },
      fetchByNameParams() {
        if (this.name && this.artist) {
          if (typeof this.artist === 'string') {
            return { track: this.name, artist: this.artist }
          } else if (this.artist.name) {
            return { track: this.name, artist: this.artist.name }
          }
        }
      },
      fetchInfo(params) {
        const fetchParams = this.fetchParams()
        if (fetchParams) {
          const key = ['trackInfo', { ...params, ...fetchParams }]
          return loader.load(key)
        }
        return Promise.resolve(this)
      }
    }
  }

  const loader = new DataLoader(
    keys => {
      return Promise.all(
        keys.map(key => {
          const [method, params = {}] = key

          switch (method) {
            case 'artistTopTracks':
            case 'chartTopTracks':
            case 'geoTopTracks':
            case 'similarTracks':
              return client[method](params).then(data => ({
                ...data,
                track: data.track.map(track => createTrack(track, method))
              }))
            case 'similarArtists':
            case 'chartTopArtists':
            case 'geoTopArtists':
              return client[method](params).then(data => ({
                ...data,
                artist: data.artist.map(artist => createArtist(artist, method))
              }))
            case 'artistTopAlbums':
              return client[method](params).then(data => ({
                ...data,
                album: data.album.map(album => createAlbum(album, method))
              }))
            case 'artistInfo':
              return client[method](params).then(artist =>
                createArtist(artist, method)
              )
            case 'albumInfo':
              return client[method](params).then(album =>
                createAlbum(album, method)
              )
            case 'trackInfo':
              return client[method](params).then(track =>
                createTrack(track, method)
              )
            case 'artistTopTags':
            case 'albumTopTags':
            case 'trackTopTags':
              return client[method](params)
            default:
              throw new Error(`Unsupported client method: ${method}`)
          }
        })
      )
    },
    {
      cacheKeyFn: ([method, params = {}]) => {
        return [method, qs.stringify(params)].join('/')
      },
      cacheMap: cache
    }
  )

  return loader
}
