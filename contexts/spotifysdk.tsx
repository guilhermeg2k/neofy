import { createContext, useState, useEffect, ReactNode } from "react";
import { spotifySDK } from "../services/spotifysdk";
import { SpotifyAPI } from "../services/spotifyapi";

interface SpotifySDKProviderProps {
  children: ReactNode;
}

interface SpotifySDKContextData {
  currentSong: string;
  currentArtist: string;
  albumImgURL: string;
  shuffle: boolean;
  paused: boolean;
  repeatMode: number;
  changeVolume: (value: number) => void;
  togglePlay: () => void;
  nextSong: () => void;
  previousSong: () => void;
  toggleShuffle: () => void;
  changeRepeatMode: () => void;
}

export const SpotifySDKContext = createContext({} as SpotifySDKContextData);

export function SpotifySDKProvider({ children }: SpotifySDKProviderProps) {
  const spotifyAPI = new SpotifyAPI();
  const [currentSong, setCurrentSong] = useState("");
  const [currentArtist, setCurrentArtist] = useState("");
  const [albumImgURL, setAlbumImgUrl] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [paused, setPaused] = useState(true);
  const [repeatMode, setRepeatMode] = useState(0);

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
    spotifySDK.onStateChange((state) => {
      let { current_track } = state.track_window;
      setCurrentSong(current_track.name);
      setCurrentArtist(current_track.artists[0].name);
      setAlbumImgUrl(current_track.album.images[0].url);
      setShuffle(state.shuffle);
      setRepeatMode(state.repeat_mode);
      setPaused(state.paused);
      console.log(state);
    });
  }, []);

  return (
    <SpotifySDKContext.Provider
      value={{
        currentSong,
        currentArtist,
        albumImgURL,
        shuffle,
        repeatMode,
        changeVolume,
        togglePlay,
        paused,
        previousSong,
        nextSong,
        toggleShuffle,
        changeRepeatMode,
      }}
    >
      {children}
    </SpotifySDKContext.Provider>
  );
}
