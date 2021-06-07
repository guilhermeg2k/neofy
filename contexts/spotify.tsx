import { createContext, useState, useEffect, ReactNode } from "react";
import { spotifySDK } from "../services/spotifysdk";
import { SpotifyAPI } from "../services/spotifyapi";
import Cookies from "js-cookie";
interface SpotifyProviderProps {
  children: ReactNode;
}

interface SpotifyContextData {
  currentSong: string;
  currentArtist: string;
  albumImgURL: string;
  shuffle: boolean;
  isPaused: boolean;
  repeatMode: number;
  currentSongPosition: number;
  currentSongDuration: number;
  changeVolume: (value: number) => void;
  togglePlay: () => void;
  nextSong: () => void;
  previousSong: () => void;
  toggleShuffle: () => void;
  changeRepeatMode: () => void;
  setCurrentSongPosition: (value: number) => void;
}

export const SpotifyContext = createContext({} as SpotifyContextData);

export function SpotifyProvider({ children }: SpotifyProviderProps) {
  const spotifyAPI = new SpotifyAPI();

  const [currentSong, setCurrentSong] = useState("");
  const [currentArtist, setCurrentArtist] = useState("");
  const [albumImgURL, setAlbumImgUrl] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [repeatMode, setRepeatMode] = useState(0);
  const [currentSongPosition, setCurrentSongPosition] = useState(0);
  const [currentSongDuration, setCurrentSongDuration] = useState(0);

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

  function changeRepeatMode() {
    let newRepeatMode = 0;
    if (repeatMode === 0) {
      newRepeatMode = 1;
    } else if (repeatMode === 1) {
      newRepeatMode = 2;
    } else {
      newRepeatMode = 0;
    }

    spotifyAPI.setRepeatMode(newRepeatMode);
  }

  useEffect(() => {
    spotifySDK.onReady(({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      Cookies.set("device-id", device_id);
      spotifyAPI.playCurrentPlayBack();
    });

    spotifySDK.onStateChange((state) => {
      let { current_track } = state.track_window;
      setCurrentSong(current_track.name);
      setCurrentArtist(current_track.artists[0].name);
      setAlbumImgUrl(current_track.album.images[0].url);
      setShuffle(state.shuffle);
      setRepeatMode(state.repeat_mode);
      setIsPaused(state.paused);
      setCurrentSongDuration(current_track.duration_ms);
      setCurrentSongPosition(state.position);
      console.log(state);
    });
  }, []);

  return (
    <SpotifyContext.Provider
      value={{
        currentSong,
        currentArtist,
        albumImgURL,
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
        setCurrentSongPosition
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}
