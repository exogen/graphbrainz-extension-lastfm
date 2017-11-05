import Client from 'graphbrainz/lib/api/client'

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

  get(method, options = {}) {
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
    return super.get(this.baseURL, options)
  }

  artistInfo(params) {
    return this.get('artist.getInfo', { qs: params }).then(
      data => data.artist || null
    )
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
    return this.get('album.getInfo', { qs: params }).then(
      data => data.album || null
    )
  }

  albumTopTags(params) {
    return this.get('album.getTopTags', { qs: params }).then(
      data => data.toptags || { tag: [] }
    )
  }

  trackInfo(params) {
    return this.get('track.getInfo', { qs: params }).then(
      data => data.track || null
    )
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
    return this.get('geo.getTopArtists', { qs: params }).then(
      data => data.topartists || { artist: [] }
    )
  }

  geoTopTracks(params) {
    return this.get('geo.getTopTracks', { qs: params }).then(
      data => data.tracks || { track: [] }
    )
  }
}
