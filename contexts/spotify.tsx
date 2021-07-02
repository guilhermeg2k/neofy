import { createContext, useState, useEffect, ReactNode } from "react";
import { spotifySDK } from "../services/spotifysdk";
import { AlbumObject, ArtistObject, PlaylistObject, SpotifyAPI, TimeRange, TrackObject } from "../services/spotifyapi";
import Cookies from "js-cookie";
interface SpotifyProviderProps {
  children: ReactNode;
}

interface SpotifyContextData {
  currentSong: string;
  currentArtist: string;
  albumImgURL: string;
  albumMediumImgURL: string;
  albumLargeImgURL: string;
  shuffle: boolean;
  isPaused: boolean;
  repeatMode: number;
  currentSongPosition: number;
  currentSongDuration: number;
  currentContext: {
    type: string,
    name: string,
  };
  changeVolume: (value: number) => void;
  togglePlay: () => void;
  nextSong: () => void;
  previousSong: () => void;
  toggleShuffle: () => void;
  changeRepeatMode: () => void;
  setCurrentSongPosition: (value: number) => void;
  seekToPosition: (position: number) => void;
  getCurrentUserPlayLists: (limit?: number, offset?: number) => Promise<Array<PlaylistObject>>;
  getUserTopArtists: (timeRange?: TimeRange, limit?: number, offset?: number) => Promise<Array<ArtistObject>>;
  getUserTopTracks: (timeRange?: TimeRange, limit?: number, offset?: number) => Promise<Array<TrackObject>>;
  getUserSavedAlbums: (limit?: number, offset?: number) => Promise<Array<AlbumObject>>;
}

export const SpotifyContext = createContext({} as SpotifyContextData);

export function SpotifyProvider({ children }: SpotifyProviderProps) {
  const spotifyAPI = new SpotifyAPI();

  const [currentSong, setCurrentSong] = useState("");
  const [currentArtist, setCurrentArtist] = useState("");
  const [albumImgURL, setAlbumImgUrl] = useState("");
  const [albumMediumImgURL, setMediumAlbumImgUrl] = useState("");
  const [albumLargeImgURL, setLargeAlbumImgUrl] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [repeatMode, setRepeatMode] = useState(0);
  const [currentSongPosition, setCurrentSongPosition] = useState(0);
  const [currentSongDuration, setCurrentSongDuration] = useState(0);
  const [currentContext, setCurrentContext] = useState({
    type: "",
    name: ""
  });

  function changeVolume(newVolume: number) {
    spotifySDK.changeVolume(newVolume);
  }

  function togglePlay() {
    spotifySDK.togglePlay();
  }

  function nextSong() {
    spotifySDK.nextSong();
  }

  function previousSong() {
    spotifySDK.previousSong();
  }

  function toggleShuffle() {
    spotifyAPI.setShuffle(!shuffle);
  }

  function seekToPosition(position: number) {
    spotifySDK.seekToPosition(position);
  }

  function changeRepeatMode() {
    let newRepeatMode = 0;
    if (repeatMode === 0) {
      newRepeatMode = 1;
    } else if (repeatMode === 1) {
      newRepeatMode = 2;
    }
    spotifyAPI.setRepeatMode(newRepeatMode);
  }

  async function getCurrentUserPlayLists(limit = 20, offset = 0): Promise<Array<PlaylistObject>>{
    return await spotifyAPI.getCurrentUserPlayLists(limit, offset);
  }

  async function getUserTopArtists(timeRange = TimeRange.short_term, limit = 10, offset = 0){
    return await spotifyAPI.getUserTopArtists(timeRange, limit, offset);
  }

  async function getUserSavedAlbums(limit = 20, offset = 0): Promise<Array<AlbumObject>>{
    return await spotifyAPI.getUserSavedAlbums(limit, offset);
  }

  async function getUserTopTracks(timeRange = TimeRange.short_term, limit = 10, offset = 0){
    return await spotifyAPI.getUserTopTracks(timeRange, limit, offset);
  }

  

  useEffect(() => {
    spotifySDK.onReady(({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      Cookies.set("device-id", device_id);
      spotifyAPI.playCurrentPlayBack();
    });

    spotifySDK.onStateChange((state) => {
      let { context } = state;
      let { current_track } = state.track_window;

      setCurrentSong(current_track.name);
      setCurrentArtist(current_track.artists[0].name);
      setAlbumImgUrl(current_track.album.images[0].url);
      setMediumAlbumImgUrl(current_track.album.images[1].url);
      setLargeAlbumImgUrl(current_track.album.images[2].url);
      setShuffle(state.shuffle);
      setRepeatMode(state.repeat_mode);
      setIsPaused(state.paused);
      setCurrentSongDuration(current_track.duration_ms);
      setCurrentSongPosition(state.position);
      setCurrentContext({
        type: context.uri.includes("playlist") ? "playlist" : context.uri.includes("artist") ? "artist" : "album",
        name: context.metadata.context_description
      })

      console.log(state);
    });
  }, []);

  return (
    <SpotifyContext.Provider
      value={{
        currentSong,
        currentArtist,
        albumImgURL,
        albumMediumImgURL,
        albumLargeImgURL,
        shuffle,
        repeatMode,
        changeVolume,
        togglePlay,
        isPaused,
        previousSong,
        nextSong,
        toggleShuffle,
        changeRepeatMode,
        currentSongDuration,
        currentSongPosition,
        setCurrentSongPosition,
        seekToPosition,
        currentContext,
        getCurrentUserPlayLists,
        getUserTopArtists,
        getUserSavedAlbums,
        getUserTopTracks
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}
