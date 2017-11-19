import Client from 'graphbrainz/lib/api/client'

// Last.fm error codes that indicate the request is safe to retry.
//
// https://www.last.fm/api/errorcodes
//
// * 8: Operation failed - Most likely the backend service failed. Please
//   try again.
// * 11: Service Offline - This service is temporarily offline. Try again later.
// * 16: The service is temporarily unavailable, please try again.
// * 29: Rate Limit Exceded - Your IP has made too many requests in a short
//   period, exceeding our API guidelines
const RETRY_CODES = new Set([8, 11, 16, 29])

export default class LastFMClient extends Client {
  constructor(
    {
      apiKey = process.env.LASTFM_API_KEY,
      baseURL = process.env.LASTFM_BASE_URL ||
        'http://ws.audioscrobbler.com/2.0/',
      limit = 5,
      period = 1000,
      ...options
    } = {}
  ) {
    super({ baseURL, limit, period, ...options })
    this.apiKey = apiKey
  }

  _get(method, options = {}, info) {
    const ClientError = this.errorClass
    if (!this.apiKey) {
      return Promise.reject(
        new ClientError('No API key was configured for the Last.fm client.')
      )
    }
    options = {
      baseUrl: '',
      json: true,
      ...options,
      qs: {
        method,
        format: 'json',
        api_key: this.apiKey,
        ...options.qs
      }
    }
    return super._get(this.baseURL, options, info).then(data => {
      if (data.error) {
        const err = new ClientError(`${data.error}: ${data.message}`)
        err.code = data.error
        throw err
      }
      return data
    })
  }

  shouldRetry(err) {
    if (err instanceof this.errorClass) {
      return RETRY_CODES.has(err.code)
    }
    return super.shouldRetry(err)
  }

  artistInfo(params) {
    return this.get('artist.getInfo', { qs: params })
      .catch(err => {
        if (err instanceof this.errorClass && err.code === 6) {
          return { artist: null }
        }
        throw err
      })
      .then(data => data.artist || null)
  }

  similarArtists(params) {
    return this.get('artist.getSimilar', { qs: params }).then(
      data => data.similarartists || { artist: [] }
    )
  }

  artistTopAlbums(params) {
    return this.get('artist.getTopAlbums', { qs: params }).then(
      data => data.topalbums || { album: [] }
    )
  }

  artistTopTags(params) {
    return this.get('artist.getTopTags', { qs: params }).then(
      data => data.toptags || { tag: [] }
    )
  }

  artistTopTracks(params) {
    return this.get('artist.getTopTracks', { qs: params }).then(
      data => data.toptracks || { track: [] }
    )
  }

  albumInfo(params) {
    return this.get('album.getInfo', { qs: params })
      .catch(err => {
        if (err instanceof this.errorClass && err.code === 6) {
          return { album: null }
        }
        throw err
      })
      .then(data => data.album || null)
  }

  albumTopTags(params) {
    return this.get('album.getTopTags', { qs: params }).then(
      data => data.toptags || { tag: [] }
    )
  }

  trackInfo(params) {
    return this.get('track.getInfo', { qs: params })
      .catch(err => {
        if (err instanceof this.errorClass && err.code === 6) {
          return { track: null }
        }
        throw err
      })
      .then(data => data.track || null)
  }

  trackTopTags(params) {
    return this.get('track.getTopTags', { qs: params }).then(
      data => data.toptags || { tag: [] }
    )
  }

  similarTracks(params) {
    return this.get('track.getSimilar', { qs: params }).then(
      data => data.similartracks || { tracks: [] }
    )
  }

  chartTopArtists(params) {
    return this.get('chart.getTopArtists', { qs: params }).then(
      data => data.artists || { artists: [] }
    )
  }

  chartTopTags(params) {
    return this.get('chart.getTopTags', { qs: params }).then(
      data => data.tags || { tag: [] }
    )
  }

  chartTopTracks(params) {
    return this.get('chart.getTopTracks', { qs: params }).then(
      data => data.tracks || { tracks: [] }
    )
  }

  geoTopArtists(params) {
    return this.get('geo.getTopArtists', { qs: params })
      .catch(err => {
        if (err instanceof this.errorClass && err.code === 6) {
          return {
            topartists: {
              artist: [],
              '@attr': {}
            }
          }
        }
        throw err
      })
      .then(data => data.topartists)
  }

  geoTopTracks(params) {
    return this.get('geo.getTopTracks', { qs: params })
      .catch(err => {
        if (err instanceof this.errorClass && err.code === 6) {
          return {
            tracks: {
              track: [],
              '@attr': {}
            }
          }
        }
        throw err
      })
      .then(data => data.tracks)
  }
}
