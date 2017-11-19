# GraphBrainz Extension: Last.fm

[![build status](https://img.shields.io/travis/exogen/graphbrainz-extension-lastfm/master.svg)](https://travis-ci.org/exogen/graphbrainz-extension-lastfm)
[![coverage](https://img.shields.io/codecov/c/github/exogen/graphbrainz-extension-lastfm.svg)](https://codecov.io/gh/exogen/graphbrainz-extension-lastfm)
[![npm version](https://img.shields.io/npm/v/graphbrainz-extension-lastfm.svg)](https://www.npmjs.com/package/graphbrainz-extension-lastfm)
[![license](https://img.shields.io/npm/l/graphbrainz-extension-lastfm.svg)](https://github.com/exogen/graphbrainz-extension-lastfm/blob/master/LICENSE)

Retrieve artist, release, and recording information from [Last.fm][].

**[Try out the live demo!][demo]** :bulb: Use the “Docs” sidebar or the
documentation below to help construct your query.

To use this extension, install [GraphBrainz][] then:

```console
$ npm install graphbrainz-extension-lastfm
$ GRAPHBRAINZ_EXTENSIONS='["graphbrainz-extension-lastfm"]' graphbrainz
```

Or, if you are using the middleware directly:

```js
import graphbrainz from 'graphbrainz'

const middleware = graphbrainz({
  // Don't forget to add the other extensions you use, too.
  extensions: ['graphbrainz-extension-lastfm']
})
```

This extension uses its own cache, separate from the MusicBrainz loader cache.

## Configuration

This extension can be configured using environment variables:

* **`LASTFM_API_KEY`**: The Last.fm API key to use. This is required for any
  fields added by the extension to successfully resolve.
* **`LASTFM_BASE_URL`**: The base URL at which to access the Last.fm API.
  Defaults to `http://ws.audioscrobbler.com/2.0/`.
* **`LASTFM_CACHE_SIZE`**: The number of items to keep in the cache. Defaults to
  `GRAPHBRAINZ_CACHE_SIZE` if defined, or `8192`.
* **`LASTFM_CACHE_TTL`**: The number of seconds to keep items in the cache.
  Defaults to `GRAPHBRAINZ_CACHE_TTL` if defined, or `86400000` (one day).

## Example Queries

Find the MBIDs of similar recordings ([try it](https://graphbrainz-extension-lastfm.herokuapp.com/?query=%7B%0A%20%20search%20%7B%0A%20%20%20%20recordings(query%3A%20%22Dream%20Baby%20Dream%20artist%3ASuicide%22%2C%20first%3A%201)%20%7B%0A%20%20%20%20%20%20nodes%20%7B%0A%20%20%20%20%20%20%20%20mbid%0A%20%20%20%20%20%20%20%20title%0A%20%20%20%20%20%20%20%20lastFM%20%7B%0A%20%20%20%20%20%20%20%20%20%20similarTracks(first%3A%205)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20edges%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20matchScore%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20node%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20mbid%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20title%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20artist%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A)):

```graphql
{
  search {
    recordings(query: "Dream Baby Dream artist:Suicide", first: 1) {
      nodes {
        mbid
        title
        lastFM {
          similarTracks(first: 5) {
            edges {
              matchScore
              node {
                mbid
                title
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
}
```

<!-- START graphql-markdown -->

## Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Objects](#objects)
    * [Area](#area)
    * [Artist](#artist)
    * [LastFMAlbum](#lastfmalbum)
    * [LastFMAlbumConnection](#lastfmalbumconnection)
    * [LastFMAlbumEdge](#lastfmalbumedge)
    * [LastFMArtist](#lastfmartist)
    * [LastFMArtistConnection](#lastfmartistconnection)
    * [LastFMArtistEdge](#lastfmartistedge)
    * [LastFMChartQuery](#lastfmchartquery)
    * [LastFMCountry](#lastfmcountry)
    * [LastFMQuery](#lastfmquery)
    * [LastFMTag](#lastfmtag)
    * [LastFMTagConnection](#lastfmtagconnection)
    * [LastFMTagEdge](#lastfmtagedge)
    * [LastFMTrack](#lastfmtrack)
    * [LastFMTrackConnection](#lastfmtrackconnection)
    * [LastFMTrackEdge](#lastfmtrackedge)
    * [LastFMWikiContent](#lastfmwikicontent)
    * [Query](#query)
    * [Recording](#recording)
    * [Release](#release)
  * [Enums](#enums)
    * [LastFMImageSize](#lastfmimagesize)

</details>

### Objects

#### Area

:small_blue_diamond: *This type has been extended.
See the [base schema](https://github.com/exogen/graphbrainz/docs/types.md) for a description and additional fields.*

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>lastFM</strong></td>
<td valign="top"><a href="#lastfmcountry">LastFMCountry</a></td>
<td>

Chart data available for this area on [Last.fm](https://www.last.fm/), if
the area represents a country with an [ISO 3166 code](https://en.wikipedia.org/wiki/ISO_3166).
This field is provided by the Last.fm extension.

</td>
</tr>
</tbody>
</table>

#### Artist

:small_blue_diamond: *This type has been extended.
See the [base schema](https://github.com/exogen/graphbrainz/docs/types.md) for a description and additional fields.*

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>lastFM</strong></td>
<td valign="top"><a href="#lastfmartist">LastFMArtist</a></td>
<td>

Data about the artist from [Last.fm](https://www.last.fm/), a good source
for measuring popularity via listener and play counts. This field is
provided by the Last.fm extension.

</td>
</tr>
</tbody>
</table>

#### LastFMAlbum

An album on [Last.fm](https://www.last.fm/) corresponding with a MusicBrainz
Release.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>mbid</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#mbid">MBID</a></td>
<td>

The MBID of the corresponding MusicBrainz release.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>title</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The title of the album according to [Last.fm](https://www.last.fm/).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#urlstring">URLString</a>!</td>
<td>

The URL for the album on [Last.fm](https://www.last.fm/).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>image</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#urlstring">URLString</a></td>
<td>

An image of the cover artwork of the release.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">size</td>
<td valign="top"><a href="#lastfmimagesize">LastFMImageSize</a></td>
<td>

The size of the image to retrieve.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>listenerCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The number of listeners recorded for the album.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>playCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The number of plays recorded for the album.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="#lastfmwikicontent">LastFMWikiContent</a></td>
<td>

Historical information written about the album, often available in several
languages.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">lang</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The two-letter code for the language in which to retrieve the description.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>artist</strong></td>
<td valign="top"><a href="#lastfmartist">LastFMArtist</a></td>
<td>

The artist who released the album. This returns the Last.fm artist info,
not the MusicBrainz artist.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>topTags</strong></td>
<td valign="top"><a href="#lastfmtagconnection">LastFMTagConnection</a></td>
<td>

A list of tags applied to the artist by users, ordered by popularity.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of tags to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more tags will be retrieved.

</td>
</tr>
</tbody>
</table>

#### LastFMAlbumConnection

A connection to a list of items.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>pageInfo</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#pageinfo">PageInfo</a>!</td>
<td>

Information to aid in pagination.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>edges</strong></td>
<td valign="top">[<a href="#lastfmalbumedge">LastFMAlbumEdge</a>]</td>
<td>

A list of edges.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nodes</strong></td>
<td valign="top">[<a href="#lastfmalbum">LastFMAlbum</a>]</td>
<td>

A list of nodes in the connection (without going through the `edges` field).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>totalCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

A count of the total number of items in this connection, ignoring pagination.

</td>
</tr>
</tbody>
</table>

#### LastFMAlbumEdge

An edge in a connection.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#lastfmalbum">LastFMAlbum</a></td>
<td>

The item at the end of the edge.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cursor</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a>!</td>
<td>

A cursor for use in pagination.

</td>
</tr>
</tbody>
</table>

#### LastFMArtist

An artist on [Last.fm](https://www.last.fm/).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>mbid</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#mbid">MBID</a></td>
<td>

The MBID of the corresponding MusicBrainz artist.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The name of the artist according to [Last.fm](https://www.last.fm/).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#urlstring">URLString</a>!</td>
<td>

The URL for the artist on [Last.fm](https://www.last.fm/).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>image</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#urlstring">URLString</a></td>
<td>

An image of the artist.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">size</td>
<td valign="top"><a href="#lastfmimagesize">LastFMImageSize</a></td>
<td>

The size of the image to retrieve.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>listenerCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The number of listeners recorded for the artist.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>playCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The number of plays recorded for the artist.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>similarArtists</strong></td>
<td valign="top"><a href="#lastfmartistconnection">LastFMArtistConnection</a></td>
<td>

A list of similar artists.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of artists to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more artists will be retrieved.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>topAlbums</strong></td>
<td valign="top"><a href="#lastfmalbumconnection">LastFMAlbumConnection</a></td>
<td>

A list of the artist’s most popular albums.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of albums to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more albums will be retrieved.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>topTags</strong></td>
<td valign="top"><a href="#lastfmtagconnection">LastFMTagConnection</a></td>
<td>

A list of tags applied to the artist by users, ordered by popularity.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of tags to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more tags will be retrieved.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>topTracks</strong></td>
<td valign="top"><a href="#lastfmtrackconnection">LastFMTrackConnection</a></td>
<td>

A list of the artist’s most popular tracks.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of tracks to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more tracks will be retrieved.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>biography</strong></td>
<td valign="top"><a href="#lastfmwikicontent">LastFMWikiContent</a></td>
<td>

A biography of the artist, often available in several languages.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">lang</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The two-letter code for the language in which to retrieve the biography.

</td>
</tr>
</tbody>
</table>

#### LastFMArtistConnection

A connection to a list of items.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>pageInfo</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#pageinfo">PageInfo</a>!</td>
<td>

Information to aid in pagination.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>edges</strong></td>
<td valign="top">[<a href="#lastfmartistedge">LastFMArtistEdge</a>]</td>
<td>

A list of edges.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nodes</strong></td>
<td valign="top">[<a href="#lastfmartist">LastFMArtist</a>]</td>
<td>

A list of nodes in the connection (without going through the `edges` field).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>totalCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

A count of the total number of items in this connection, ignoring pagination.

</td>
</tr>
</tbody>
</table>

#### LastFMArtistEdge

An edge in a connection.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#lastfmartist">LastFMArtist</a></td>
<td>

The item at the end of the edge.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cursor</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a>!</td>
<td>

A cursor for use in pagination.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>matchScore</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#float">Float</a></td>
<td>

The artist similarity score (0–1) as determined by [Last.fm](https://www.last.fm/),
if this connection is with another artist.

</td>
</tr>
</tbody>
</table>

#### LastFMChartQuery

A query for chart data on [Last.fm](https://www.last.fm/).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>topArtists</strong></td>
<td valign="top"><a href="#lastfmartistconnection">LastFMArtistConnection</a></td>
<td>

The most popular artists, ordered by popularity. If a country code is
given, retrieve the most popular artists in that country.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">country</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

A two-letter [ISO 3166 country code](https://en.wikipedia.org/wiki/ISO_3166).

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of artists to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more artists will be retrieved.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>topTags</strong></td>
<td valign="top"><a href="#lastfmtagconnection">LastFMTagConnection</a></td>
<td>

The most popular tags, ordered by popularity.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of tags to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more tags will be retrieved.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>topTracks</strong></td>
<td valign="top"><a href="#lastfmtrackconnection">LastFMTrackConnection</a></td>
<td>

The most popular tracks, ordered by popularity. If a country code is
given, retrieve the most popular tracks in that country.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">country</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

A two-letter [ISO 3166 country code](https://en.wikipedia.org/wiki/ISO_3166).

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of tracks to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more tracks will be retrieved.

</td>
</tr>
</tbody>
</table>

#### LastFMCountry

A country with chart data available on [Last.fm](https://www.last.fm/).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>topArtists</strong></td>
<td valign="top"><a href="#lastfmartistconnection">LastFMArtistConnection</a></td>
<td>

The top artists in this country, ordered by popularity.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of artists to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more artists will be retrieved.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>topTracks</strong></td>
<td valign="top"><a href="#lastfmtrackconnection">LastFMTrackConnection</a></td>
<td>

The top tracks in this country, ordered by popularity.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of tracks to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more tracks will be retrieved.

</td>
</tr>
</tbody>
</table>

#### LastFMQuery

The different types of [Last.fm](https://www.last.fm/) queries that can be
made that are not connected to any particular MusicBrainz entity.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>chart</strong></td>
<td valign="top"><a href="#lastfmchartquery">LastFMChartQuery</a>!</td>
<td>

A query for chart data.

</td>
</tr>
</tbody>
</table>

#### LastFMTag

A tag added by users to an entity on [Last.fm](https://www.last.fm/).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a>!</td>
<td>

The tag name.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#urlstring">URLString</a>!</td>
<td>

The URL for the tag on [Last.fm](https://www.last.fm/).

</td>
</tr>
</tbody>
</table>

#### LastFMTagConnection

A connection to a list of items.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>pageInfo</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#pageinfo">PageInfo</a>!</td>
<td>

Information to aid in pagination.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>edges</strong></td>
<td valign="top">[<a href="#lastfmtagedge">LastFMTagEdge</a>]</td>
<td>

A list of edges.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nodes</strong></td>
<td valign="top">[<a href="#lastfmtag">LastFMTag</a>]</td>
<td>

A list of nodes in the connection (without going through the `edges` field).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>totalCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

A count of the total number of items in this connection, ignoring pagination.

</td>
</tr>
</tbody>
</table>

#### LastFMTagEdge

An edge in a connection.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#lastfmtag">LastFMTag</a></td>
<td>

The item at the end of the edge.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cursor</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a>!</td>
<td>

A cursor for use in pagination.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tagCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The number of times the tag has been applied to the item in question.

</td>
</tr>
</tbody>
</table>

#### LastFMTrack

A track on [Last.fm](https://www.last.fm/) corresponding with a MusicBrainz
Recording.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>mbid</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#mbid">MBID</a></td>
<td>

The MBID of the corresponding MusicBrainz recording.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>title</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The title of the track according to [Last.fm](https://www.last.fm/).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#urlstring">URLString</a>!</td>
<td>

The URL for the track on [Last.fm](https://www.last.fm/).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>duration</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#duration">Duration</a></td>
<td>

The length of the track.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>listenerCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The number of listeners recorded for the track.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>playCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The number of plays recorded for the track.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="#lastfmwikicontent">LastFMWikiContent</a></td>
<td>

Historical information written about the track, often available in several
languages.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">lang</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The two-letter code for the language in which to retrieve the description.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>artist</strong></td>
<td valign="top"><a href="#lastfmartist">LastFMArtist</a></td>
<td>

The artist who released the track. This returns the Last.fm artist info,
not the MusicBrainz artist.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>album</strong></td>
<td valign="top"><a href="#lastfmalbum">LastFMAlbum</a></td>
<td>

The album on which the track appears. This returns the Last.fm album info,
not the MusicBrainz release.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>similarTracks</strong></td>
<td valign="top"><a href="#lastfmtrackconnection">LastFMTrackConnection</a></td>
<td>

A list of similar tracks.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of tracks to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more tracks will be retrieved.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>topTags</strong></td>
<td valign="top"><a href="#lastfmtagconnection">LastFMTagConnection</a></td>
<td>

A list of tags applied to the track by users, ordered by popularity.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

The maximum number of tags to retrieve.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The cursor of the edge after which more tags will be retrieved.

</td>
</tr>
</tbody>
</table>

#### LastFMTrackConnection

A connection to a list of items.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>pageInfo</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#pageinfo">PageInfo</a>!</td>
<td>

Information to aid in pagination.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>edges</strong></td>
<td valign="top">[<a href="#lastfmtrackedge">LastFMTrackEdge</a>]</td>
<td>

A list of edges.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nodes</strong></td>
<td valign="top">[<a href="#lastfmtrack">LastFMTrack</a>]</td>
<td>

A list of nodes in the connection (without going through the `edges` field).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>totalCount</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#int">Int</a></td>
<td>

A count of the total number of items in this connection, ignoring pagination.

</td>
</tr>
</tbody>
</table>

#### LastFMTrackEdge

An edge in a connection.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#lastfmtrack">LastFMTrack</a></td>
<td>

The item at the end of the edge.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cursor</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a>!</td>
<td>

A cursor for use in pagination.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>matchScore</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#float">Float</a></td>
<td>

The track similarity score (0–1) as determined by [Last.fm](https://www.last.fm/),
if this connection is with another track.

</td>
</tr>
</tbody>
</table>

#### LastFMWikiContent

Biographical or background information written about an entity on
[Last.fm](https://www.last.fm/).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>summaryHTML</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

A summary of the wiki content, which may contain HTML.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>contentHTML</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#string">String</a></td>
<td>

The full wiki content, which may contain HTML.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>publishDate</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#date">Date</a></td>
<td>

The date the content was published. The data is reformatted from the
Last.fm API’s original format into the Date scalar format.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>publishTime</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#time">Time</a></td>
<td>

The time the content was published. The data is reformatted from the
Last.fm API’s original format into the Time scalar format. The API offers
no indication as to which time zone the time is in.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top"><a href="https://github.com/exogen/graphbrainz/docs/types.md#urlstring">URLString</a></td>
<td>

The URL at which the content was published.

</td>
</tr>
</tbody>
</table>

#### Query

:small_blue_diamond: *This type has been extended.
See the [base schema](https://github.com/exogen/graphbrainz/docs/types.md) for a description and additional fields.*

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>lastFM</strong></td>
<td valign="top"><a href="#lastfmquery">LastFMQuery</a></td>
<td>

A query for data on [Last.fm](https://www.last.fm/) that is not connected
to any particular MusicBrainz entity. This field is provided by the
Last.fm extension.

</td>
</tr>
</tbody>
</table>

#### Recording

:small_blue_diamond: *This type has been extended.
See the [base schema](https://github.com/exogen/graphbrainz/docs/types.md) for a description and additional fields.*

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>lastFM</strong></td>
<td valign="top"><a href="#lastfmtrack">LastFMTrack</a></td>
<td>

Data about the recording from [Last.fm](https://www.last.fm/), a good
source for measuring popularity via listener and play counts. This field
is provided by the Last.fm extension.

</td>
</tr>
</tbody>
</table>

#### Release

:small_blue_diamond: *This type has been extended.
See the [base schema](https://github.com/exogen/graphbrainz/docs/types.md) for a description and additional fields.*

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>lastFM</strong></td>
<td valign="top"><a href="#lastfmalbum">LastFMAlbum</a></td>
<td>

Data about the release from [Last.fm](https://www.last.fm/), a good source
for measuring popularity via listener and play counts. This field is
provided by the Last.fm extension.

</td>
</tr>
</tbody>
</table>

### Enums

#### LastFMImageSize

The image sizes that may be requested at [Last.fm](https://www.last.fm/).

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>SMALL</strong></td>
<td>

A maximum dimension of 34px.

</td>
</tr>
<tr>
<td valign="top"><strong>MEDIUM</strong></td>
<td>

A maximum dimension of 64px.

</td>
</tr>
<tr>
<td valign="top"><strong>LARGE</strong></td>
<td>

A maximum dimension of 174px.

</td>
</tr>
<tr>
<td valign="top"><strong>EXTRALARGE</strong></td>
<td>

A maximum dimension of 300px.

</td>
</tr>
<tr>
<td valign="top"><strong>MEGA</strong></td>
<td>

A maximum dimension of 300px.

</td>
</tr>
</tbody>
</table>

<!-- END graphql-markdown -->

[Last.fm]: https://www.last.fm/
[GraphBrainz]: https://github.com/exogen/graphbrainz
[demo]: https://graphbrainz-extension-lastfm.herokuapp.com/
