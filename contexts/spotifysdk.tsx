import { createContext, useState, useEffect, ReactNode } from "react";

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
}

export const SpotifySDKContext = createContext({} as SpotifySDKContextData);

export function SpotifySDKProvider({ children }: SpotifySDKProviderProps) {
  const [currentSong, setCurrentSong] = useState("");
  const [currentArtist, setCurrentArtist] = useState("");
  const [albumImgURL, setAlbumImgUrl] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [paused, setPaused] = useState(true);
  const [repeatMode, setRepeatMode] = useState(0);
  const [player, setPlayer] = useState({});
  const token =
    "BQDpMgb_2DTRkIyAYoBiWnci9eDXth8FjzkknpRtGOi2z_R7qfvD711rKh02WSE1N7SPFlWC7_kJKVZKsey2HnHpakDABySgVAwvmzW5PwphnHeTJ7ltEW95pJlZY3d3QAj3udnZN5jVKEZ8GF74-QrVjaP0fQXxVhP-Lfz7IGQ8mivLKrz0kNk";

  function changeVolume(newVolume: number) {
    player.setVolume(newVolume).then(() => {
      console.log("Volume updated!");
    });
  }

  function togglePlay() {
    player.togglePlay().then(() => {
      console.log("Toggled playback!");
    });
  }

  function nextSong() {
    player.nextTrack().then(() => {
      console.log("Skipped to next track!");
    });
  }

  function previousSong() {
    player.previousTrack().then(() => {
      console.log("Set to previous track!");
    });
  }

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const _player = new Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
      });
      // Error handling
      _player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });
      _player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });
      _player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      _player.addListener("playback_error", ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      _player.addListener("player_state_changed", (state) => {
        let { current_track } = state.track_window;
        setCurrentSong(current_track.name);
        setCurrentArtist(current_track.artists[0].name);
        setAlbumImgUrl(current_track.album.images[0].url);
        setShuffle(state.shuffle);
        setRepeatMode(state.repeatMode);
        setPaused(state.paused);
        console.log(state);
      });

      // Ready
      _player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      // Not Ready
      _player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        _player.setName("Shak3nFy");
      });

      // Connect to the player!
      _player.connect();
      setPlayer(_player);
    };
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
      }}
    >
      {children}
    </SpotifySDKContext.Provider>
  );
}
