<p align="center">
  <img src="https://github.com/KennethOnuorah/Javascript-Music/blob/main/README_logo.png" width="336" height="309">
</p>

<p align="center">
  A music player web application
</p>

------

## About the project 🔎

A web application for uploading and listening to all of your favorite music. Fill your library with the songs, albums, and artists that define you.

This application requires audio metadata in order to function properly! For a better user experience, it is highly recommeded that your audio files contain id3 tag information for the application to read. You can edit the metadata of your song files by right-clicking on them and navigating to **Properties > Details** (or **Edit > Get Info** for Mac users), then edit each tag with the correct information. Or you can visit [tagmp3.net](https://tagmp3.net/).

If, however, you have [Spotify Premium](https://www.spotify.com/us/premium/), [Deezer Premium](https://www.deezer.com/us/offers/premium), [Pandora Premium](https://www.pandora.com/upgrade/premium), or any other premium subscription from a music streaming service, then you can easily download your playlists from there and upload them with the metadata already included. That way, you don't have to go through the trouble of editing each song's tag information.

The id3 tag information the application reads:
1. Song title
2. Contributing artists
3. Song year (optional)

Acceptable file types:
* .mp3
* .wav
* .ogg
* .flac

Languages used:
* HTML
* CSS/SCSS
* Javascript

❗❗❗ AFAIK, this application only works for chromium browsers.

**Project development**: 9/27/2022 - 10/27/2022

## Features 📦️
- [x] Uploading albums from filesystem
- [x] Deleting albums
- [x] Metadata reading
- [x] Album information modal
  * Displays the name of the album and its cover, the artist(s) who contributed to the album, and the time span the songs were recorded
- [x] Music controlling
  * Playing/pausing songs
  * Unlimited skipping, replaying, and playing previous songs
  * Shuffle mode
  * Album and song looping
  * Song length bar and time display
  * Volume adjustment
- [x] Album cover customization
- [x] Search bar functionality
- [x] Saving and loading

## Preview 👁️

![readme_preview](https://github.com/KennethOnuorah/Javascript-Music/blob/main/app_screenshot.png)

## License 📜
[**MIT**](https://github.com/KennethOnuorah/Javascript-Music/blob/main/LICENSE)
