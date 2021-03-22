import Cookies from "js-cookie";

import { SpotifyAPI } from "../services/spotifyapi";

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (
    eventName: string,
    cb: (
      param: WebPlayblackPlayer | WebPlaybackState | WebPlaybackError
    ) => void
  ) => boolean;

  removeListener: (eventName: string, cb: ({}) => void) => boolean;
  getCurrentState: (cb: (state: WebPlaybackState) => void) => void;
  setName: (newName: string) => Promise<boolean>;
  getVolume: () => Promise<number>;
  setVolume: (newVolume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (minute: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

interface WebPlayblackPlayer {
  device_id: string;
}

interface WebPlaybackState {
  context: {
    uri: string; // The URI of the context (can be void)
    metadata: {}; // Additional metadata for the context (can be void)
  };
  disallows: {
    // A simplified set of restriction controls for
    pausing: boolean; // The current track. By default, these fields
    peeking_next: boolean; // will either be set to false or undefined, which
    peeking_prev: boolean; // indicates that the particular operation is
    resuming: boolean; // allowed. When the field is set to `true`, this
    seeking: boolean; // means that the operation is not permitted. For
    skipping_next: boolean; // example, `skipping_next`, `skipping_prev` and
    skipping_prev: boolean; // `seeking` will be set to `true` when playing an
    // ad track.
  };
  paused: boolean; // Whether the current track is paused.
  position: number; // The position_ms of the current track.
  repeat_mode: number; // The repeat mode. No repeat mode is 0,
  // once-repeat is 1 and full repeat is 2.
  shuffle: boolean; // True if shuffled, false otherwise.
  track_window: {
    current_track: WebPlaybackTrack; // The track currently on local playback
    previous_tracks: Array<WebPlaybackTrack>; // Previously played tracks. Number can vary.
    next_tracks: Array<WebPlaybackTrack>; // Tracks queued next. Number can vary.
  };
}

interface WebPlaybackTrack {
  uri: string; // Spotify URI
  id: string; // Spotify ID from URI (can be void)
  type: string; // Content type: can be "track", "episode" or "ad"
  media_type: string; // Type of file: can be "audio" or "video"
  name: string; // Name of content
  is_playable: boolean; // Flag indicating whether it can be played
  album: {
    uri: string; // Spotify Album URI
    name: string;
    images: [{ url: string }];
  };
  artists: [{ uri: string; name: string }];
}

interface WebPlaybackError {
  message: string;
}

export let spotifySDK: SpotifySDK;
export function initSpotifySDK() {
  if (typeof window !== "undefined") {
    const token = SpotifyAPI.userCredencials.acessToken;
    spotifySDK = new SpotifySDK(token);
  }
}

class SpotifySDK {
  player: SpotifyPlayer;
  constructor(token: string) {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      this.player = new Spotify.Player({
        name: "Neofy",
        getOAuthToken: (cb) => {
          cb(token);
        },
      });

      // Error handling
      this.player.addListener(
        "initialization_error",
        ({ message }: WebPlaybackError) => {
          console.error(message);
        }
      );

      this.player.addListener(
        "authentication_error",
        ({ message }: WebPlaybackError) => {
          console.error(message);
        }
      );

      this.player.addListener(
        "account_error",
        ({ message }: WebPlaybackError) => {
          console.error(message);
        }
      );

      this.player.addListener(
        "playback_error",
        ({ message }: WebPlaybackError) => {
          console.error(message);
        }
      );

      this.player.addListener("ready", ({ device_id }: WebPlayblackPlayer) => {
        console.log("Ready with Device ID", device_id);
        Cookies.set("device-id", device_id);
        let spotifyAPI = new SpotifyAPI();
        spotifyAPI.playCurrentPlayBack();
      });

      // Not Ready
      this.player.addListener(
        "not_ready",
        ({ device_id }: WebPlayblackPlayer) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      // Connect to the player!
      this.player.connect();
    };
  }

  onStateChange(callback: (state: WebPlaybackState) => void) {
    this.player?.addListener(
      "player_state_changed",
      (state: WebPlaybackState) => {
        callback(state);
      }
    );
  }

  changeVolume(newVolume: number) {
    this.player?.setVolume(newVolume);
  }
  togglePlay() {
    this.player?.togglePlay();
  }

  nextSong() {
    this.player?.nextTrack();
  }

  previousSong() {
    this.player?.previousTrack();
  }
}
