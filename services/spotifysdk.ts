import Cookies from "js-cookie";
import { spotifyAPI, SpotifyAPI } from "../services/spotifyapi";

export interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (
    eventName: string,
    cb: (
      param: WebPlayblackPlayer | WebPlaybackState | WebPlaybackError
    ) => void
  ) => boolean;

  removeListener: (eventName: string, cb: ({ }) => void) => boolean;
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

export interface WebPlayblackPlayer {
  device_id: string;
}

export interface WebPlaybackState {
  context: {
    uri: string; // The URI of the context (can be void)
    metadata: {
      context_description: string;
    }; // Additional metadata for the context (can be void)
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
  track_window: TrackWindow;
}

export interface TrackWindow {
  current_track: WebPlaybackTrack; // The track currently on local playback
  previous_tracks: Array<WebPlaybackTrack>; // Previously played tracks. Number can vary.
  next_tracks: Array<WebPlaybackTrack>;
}

export interface WebPlaybackTrack {
  uri: string; // Spotify URI
  id: string; // Spotify ID from URI (can be void)
  type: string; // Content type: can be "track", "episode" or "ad"
  media_type: string; // Type of file: can be "audio" or "video"
  name: string; // Name of content
  is_playable: boolean; // Flag indicating whether it can be played
  duration_ms: number;
  album: {
    uri: string; // Spotify Album URI
    name: string;
    images: [{ url: string }, { url: string }, { url: string }];
  };
  artists: [{ uri: string; name: string }];
}

export interface WebPlaybackError {
  message: string;
}

export var spotifySDK: SpotifySDK;

export function initSpotifySDK() {
  if (process.browser) {
    spotifySDK = new SpotifySDK();
  }
}

class SpotifySDK {
  player: Spotify.Player;

  constructor() {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

      this.player = new window.Spotify.Player({
        name: 'Neofy',
        getOAuthToken: (cb) => {
          const token = SpotifyAPI.userCredencials.acessToken;
          cb(token);
        },
        volume: 0.5
      });

      this.player.addListener('ready', ({ device_id }) => {
        Cookies.set("device-id", device_id);
        spotifyAPI.playCurrentPlayBack();
        console.log('Ready with Device ID', device_id);
      });

      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      this.player.addListener('player_state_changed', (state: Spotify.PlaybackState) => {
        const stateChangeEvent = new CustomEvent('changeStateEvent', {detail: state});
        document.dispatchEvent(stateChangeEvent);
      });

      // Error handling
      this.player.addListener("initialization_error", ({ message }: WebPlaybackError) => {
        console.error(message);
      });

      this.player.addListener("authentication_error", ({ message }: WebPlaybackError) => {
        console.error(message);
      });

      this.player.addListener("account_error", ({ message }: WebPlaybackError) => {
        console.error(message);
      });

      this.player.addListener("playback_error", ({ message }: WebPlaybackError) => {
        console.error(message);
      });

      this.player.connect();
    };
  };

  onStateChange(callback: (state: Spotify.PlaybackState) => void) {
    document.addEventListener('changeStateEvent', (e: CustomEvent) => {
      callback(e.detail);
    });
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

  seekToPosition(position: number) {
    this.player?.seek(position);
  }

}


