export default `

# The image sizes that may be requested at [Last.fm](https://www.last.fm/).
enum LastFMImageSize {
  # A maximum dimension of 34px.
  SMALL

  # A maximum dimension of 64px.
  MEDIUM

  # A maximum dimension of 174px.
  LARGE

  # A maximum dimension of 300px.
  EXTRALARGE

  # A maximum dimension of 300px.
  MEGA
}

# Biographical or background information written about an entity on
# [Last.fm](https://www.last.fm/).
type LastFMWikiContent {
  # A summary of the wiki content, which may contain HTML.
  summaryHTML: String

  # The full wiki content, which may contain HTML.
  contentHTML: String

  # The date the content was published. The data is reformatted from the Last.fm
  # API’s original format into the Date scalar format.
  publishDate: Date

  # The time the content was published. The data is reformatted from the Last.fm
  # API’s original format into the Time scalar format. The API offers no
  # indication as to which time zone the time is in.
  publishTime: Time

  # The URL at which the content was published.
  url: URLString
}

# A tag added by users to an entity on [Last.fm](https://www.last.fm/).
type LastFMTag {
  # The tag name.
  name: String!

  # The URL for the tag on [Last.fm](https://www.last.fm/).
  url: URLString!
}

# An artist on [Last.fm](https://www.last.fm/).
type LastFMArtist {
  # The MBID of the corresponding MusicBrainz artist.
  mbid: MBID

  # The name of the artist according to [Last.fm](https://www.last.fm/).
  name: String

  # The URL for the artist on [Last.fm](https://www.last.fm/).
  url: URLString!

  # An image of the artist.
  image(
    # The size of the image to retrieve.
    size: LastFMImageSize
  ): URLString

  # The number of listeners recorded for the artist.
  listenerCount: Int

  # The number of plays recorded for the artist.
  playCount: Int

  # A list of similar artists.
  similarArtists(
    # The maximum number of artists to retrieve.
    first: Int,

    # The cursor of the edge after which more artists will be retrieved.
    after: String
  ): LastFMArtistConnection

  # A list of the artist’s most popular albums.
  topAlbums(
    # The maximum number of albums to retrieve.
    first: Int,

    # The cursor of the edge after which more albums will be retrieved.
    after: String
  ): LastFMAlbumConnection

  # A list of tags applied to the artist by users, ordered by popularity.
  topTags(
    # The maximum number of tags to retrieve.
    first: Int,

    # The cursor of the edge after which more tags will be retrieved.
    after: String
  ): LastFMTagConnection

  # A list of the artist’s most popular tracks.
  topTracks(
    # The maximum number of tracks to retrieve.
    first: Int,

    # The cursor of the edge after which more tracks will be retrieved.
    after: String
  ): LastFMTrackConnection

  # A biography of the artist, often available in several languages.
  biography(
    # The two-letter code for the language in which to retrieve the biography.
    lang: String
  ): LastFMWikiContent
}

# An album on [Last.fm](https://www.last.fm/) corresponding with a MusicBrainz
# Release.
type LastFMAlbum {
  # The MBID of the corresponding MusicBrainz release.
  mbid: MBID

  # The title of the album according to [Last.fm](https://www.last.fm/).
  title: String

  # The URL for the album on [Last.fm](https://www.last.fm/).
  url: URLString!

  # An image of the cover artwork of the release.
  image(
    # The size of the image to retrieve.
    size: LastFMImageSize
  ): URLString

  # The number of listeners recorded for the album.
  listenerCount: Int

  # The number of plays recorded for the album.
  playCount: Int

  # Historical information written about the album, often available in several
  # languages.
  description(
    # The two-letter code for the language in which to retrieve the description.
    lang: String
  ): LastFMWikiContent

  # The artist who released the album. This returns the Last.fm artist info, not
  # the MusicBrainz artist.
  artist: LastFMArtist

  # A list of tags applied to the artist by users, ordered by popularity.
  topTags(
    # The maximum number of tags to retrieve.
    first: Int,

    # The cursor of the edge after which more tags will be retrieved.
    after: String
  ): LastFMTagConnection
}

# A track on [Last.fm](https://www.last.fm/) corresponding with a MusicBrainz
# Recording.
type LastFMTrack {
  # The MBID of the corresponding MusicBrainz recording.
  mbid: MBID

  # The title of the track according to [Last.fm](https://www.last.fm/).
  title: String

  # The URL for the track on [Last.fm](https://www.last.fm/).
  url: URLString!

  # The length of the track.
  duration: Duration

  # The number of listeners recorded for the track.
  listenerCount: Int

  # The number of plays recorded for the track.
  playCount: Int

  # Historical information written about the track, often available in several
  # languages.
  description(
    # The two-letter code for the language in which to retrieve the description.
    lang: String
  ): LastFMWikiContent

  # The artist who released the track. This returns the Last.fm artist info, not
  # the MusicBrainz artist.
  artist: LastFMArtist

  # The album on which the track appears. This returns the Last.fm album info,
  # not the MusicBrainz release.
  album: LastFMAlbum

  # A list of similar tracks.
  similarTracks(
    # The maximum number of tracks to retrieve.
    first: Int,

    # The cursor of the edge after which more tracks will be retrieved.
    after: String
  ): LastFMTrackConnection

  # A list of tags applied to the track by users, ordered by popularity.
  topTags(
    # The maximum number of tags to retrieve.
    first: Int,

    # The cursor of the edge after which more tags will be retrieved.
    after: String
  ): LastFMTagConnection
}

# A country with chart data available on [Last.fm](https://www.last.fm/).
type LastFMCountry {
  # The top artists in this country, ordered by popularity.
  topArtists(
    # The maximum number of artists to retrieve.
    first: Int,

    # The cursor of the edge after which more artists will be retrieved.
    after: String
  ): LastFMArtistConnection

  # The top tracks in this country, ordered by popularity.
  topTracks(
    # The maximum number of tracks to retrieve.
    first: Int,

    # The cursor of the edge after which more tracks will be retrieved.
    after: String
  ): LastFMTrackConnection
}

# A query for chart data on [Last.fm](https://www.last.fm/).
type LastFMChartQuery {
  # The most popular artists, ordered by popularity. If a country code is given,
  # retrieve the most popular artists in that country.
  topArtists(
    # A two-letter [ISO 3166 country code](https://en.wikipedia.org/wiki/ISO_3166).
    country: String,

    # The maximum number of artists to retrieve.
    first: Int,

    # The cursor of the edge after which more artists will be retrieved.
    after: String
  ): LastFMArtistConnection

  # The most popular tags, ordered by popularity.
  topTags(
    # The maximum number of tags to retrieve.
    first: Int,

    # The cursor of the edge after which more tags will be retrieved.
    after: String
  ): LastFMTagConnection

  # The most popular artists, ordered by popularity. If a country code is given,
  # retrieve the most popular artists in that country.
  topTracks(
    # A two-letter [ISO 3166 country code](https://en.wikipedia.org/wiki/ISO_3166).
    country: String,

    # The maximum number of tracks to retrieve.
    first: Int,

    # The cursor of the edge after which more tracks will be retrieved.
    after: String
  ): LastFMTrackConnection
}

# The different types of [Last.fm](https://www.last.fm/) queries that can be
# made that are not connected to any particular MusicBrainz entity.
type LastFMQuery {
  # A query for chart data.
  chart: LastFMChartQuery!
}

# A connection to a list of items.
type LastFMArtistConnection {
  # Information to aid in pagination.
  pageInfo: PageInfo!

  # A list of edges.
  edges: [LastFMArtistEdge]

  # A list of nodes in the connection (without going through the \`edges\` field).
  nodes: [LastFMArtist]

  # A count of the total number of items in this connection, ignoring pagination.
  totalCount: Int
}

# An edge in a connection.
type LastFMArtistEdge {
  # The item at the end of the edge.
  node: LastFMArtist

  # A cursor for use in pagination.
  cursor: String!

  # The artist similarity score (0–1) as determined by [Last.fm](https://www.last.fm/),
  # if this connection is with another artist.
  matchScore: Float
}

# A connection to a list of items.
type LastFMTagConnection {
  # Information to aid in pagination.
  pageInfo: PageInfo!

  # A list of edges.
  edges: [LastFMTagEdge]

  # A list of nodes in the connection (without going through the \`edges\` field).
  nodes: [LastFMTag]

  # A count of the total number of items in this connection, ignoring pagination.
  totalCount: Int
}

# An edge in a connection.
type LastFMTagEdge {
  # The item at the end of the edge.
  node: LastFMTag

  # A cursor for use in pagination.
  cursor: String!

  # The number of times the tag has been applied to the item in question.
  tagCount: Int
}

# A connection to a list of items.
type LastFMAlbumConnection {
  # Information to aid in pagination.
  pageInfo: PageInfo!

  # A list of edges.
  edges: [LastFMAlbumEdge]

  # A list of nodes in the connection (without going through the \`edges\` field).
  nodes: [LastFMAlbum]

  # A count of the total number of items in this connection, ignoring pagination.
  totalCount: Int
}

# An edge in a connection.
type LastFMAlbumEdge {
  # The item at the end of the edge.
  node: LastFMAlbum

  # A cursor for use in pagination.
  cursor: String!
}

# A connection to a list of items.
type LastFMTrackConnection {
  # Information to aid in pagination.
  pageInfo: PageInfo!

  # A list of edges.
  edges: [LastFMTrackEdge]

  # A list of nodes in the connection (without going through the \`edges\` field).
  nodes: [LastFMTrack]

  # A count of the total number of items in this connection, ignoring pagination.
  totalCount: Int
}

# An edge in a connection.
type LastFMTrackEdge {
  # The item at the end of the edge.
  node: LastFMTrack

  # A cursor for use in pagination.
  cursor: String!

  # The track similarity score (0–1) as determined by [Last.fm](https://www.last.fm/),
  # if this connection is with another track.
  matchScore: Float
}

extend type Area {
  # Chart data available for this area on [Last.fm](https://www.last.fm/), if
  # the area represents a country with an [ISO 3166 code](https://en.wikipedia.org/wiki/ISO_3166).
  # This field is provided by the Last.fm extension.
  lastFM: LastFMCountry
}

extend type Artist {
  # Data about the artist from [Last.fm](https://www.last.fm/), a good source
  # for measuring popularity via listener and play counts. This field is
  # provided by the Last.fm extension.
  lastFM: LastFMArtist
}

extend type Recording {
  # Data about the recording from [Last.fm](https://www.last.fm/), a good source
  # for measuring popularity via listener and play counts. This field is
  # provided by the Last.fm extension.
  lastFM: LastFMTrack
}

extend type Release {
  # Data about the release from [Last.fm](https://www.last.fm/), a good source
  # for measuring popularity via listener and play counts. This field is
  # provided by the Last.fm extension.
  lastFM: LastFMAlbum
}

extend type Query {
  # A query for data on [Last.fm](https://www.last.fm/) that is not connected
  # to any particular MusicBrainz entity. This field is provided by the Last.fm
  # extension.
  lastFM: LastFMQuery
}

`
