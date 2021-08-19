import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { generateRandomString, generatecodeChallenge } from "../utils";

export interface UserCredencials {
  acessToken: string;
  tokenType: string;
  scope: string;
  expiresIn: string;
  refreshToken: string;
  createdAt: number;
}

export interface ExternalUrlObject {
  spotify: string;
}

export interface FollowersObject {
  href: string;
  total: number;
}

export interface PublicUserObject {
  display_name: string;
  external_url: ExternalUrlObject;
  followers: FollowersObject;
  href: string;
  id: string;
  images: Array<ImageObject>;
  type: string;
  uri: string;
}

export interface PlaylistTrackObject {
  added_at: Date;
  added_by: PublicUserObject;
  is_local: boolean;
  track: string;
}

export interface PlaylistObject {
  collaborative: boolean;
  description: string;
  id: string;
  external_urls: ExternalUrlObject;
  followers: FollowersObject;
  images: Array<ImageObject>;
  name: string;
  owner: PublicUserObject;
  public: boolean;
  snapshot_id: string;
  tracks: Array<PlaylistTrackObject>;
  type: string;
  uri: string;
}

export interface ArtistObject {
  external_urls: ExternalUrlObject;
  followers: FollowersObject;
  genres: Array<string>;
  href: string;
  id: string;
  images: Array<ImageObject>;
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface ImageObject {
  height: number;
  url: string;
  width: string;
}

export interface TrackObject {
  album: SimplifiedAlbumObject;
  artists: Array<ArtistObject>;
  available_markets: Array<string>;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIdObject;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  linked_from: LinkedTrackObject;
  name: string;
  popularity: number;
  preview_url: string;
  restrictions: TrackRestrictionObject;
  track_number: number;
  type: string;
  uri: string;
}

export interface SimplifiedTrackObject {
  artists: Array<ArtistObject>;
  available_markets: Array<string>;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  linked_from: LinkedTrackObject;
  name: string;
  preview_url: string;
  restrictions: TrackRestrictionObject;
  track_number: number;
  type: string;
  uri: string;
}

export interface TrackRestrictionObject {
  reaason: string;
}

export interface LinkedTrackObject {
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface SimplifiedAlbumObject {
  album_group: string;
  album_type: string;
  artists: Array<ArtistObject>;
  available_markets: Array<string>;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: Array<ImageObject>;
  label: string;
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: AlbumRestrictionObject;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface AlbumObject {
  album_type: string;
  artists: Array<ArtistObject>;
  available_markets: Array<string>;
  copyrights: Array<CopyrightObject>;
  external_ids: ExternalIdObject;
  external_urls: ExternalUrlObject;
  genres: Array<string>;
  href: string;
  id: string;
  images: Array<ImageObject>;
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  restrictions: AlbumRestrictionObject;
  total_tracks: number;
  tracks: Array<SimplifiedTrackObject>;
  type: string;
  uri: string;
}


export interface AlbumRestrictionObject {
  reason: string;
}
export interface ExternalIdObject {
  ean: string;
  isrc: string;
  upc: string;
}

export interface CopyrightObject {
  text: string;
  type: string;
}
export interface SavedAlbumObject {
  added_at: Date;
  album: AlbumObject;
}

export interface PlayHistoryObject {
  context: ContextObject;
  played_at: Date;
  track: TrackObject;
}

export interface ContextObject {
  external_urls: ExternalUrlObject
  href: string;
  type: string;
  uri: string;
}

export interface SavedAlbumObject {
  added_at: Date;
  album: AlbumObject;
}

export interface SavedTrackObject {
  added_at: Date;
  track: TrackObject;
}

export enum TimeRange {
  long_term,
  medium_term,
  short_term
}


export class SpotifyAPI {
  private axios: AxiosInstance;
  static clientID = "eca09370790043d6a575e301b2da83ca";
  static redirectURL = "http://localhost:3000/auth";
  static scopes = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-follow-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-top-read",
    "user-library-read",
    "user-follow-read",
    "user-read-recently-played"
  ];

  constructor() {
    this.axios = axios.create({
      baseURL: "https://api.spotify.com/v1/",
      headers: {
        Authorization: `${SpotifyAPI.userCredencials.tokenType} ${SpotifyAPI.userCredencials.acessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  syncApiToken(){
    this.axios = axios.create({
      baseURL: "https://api.spotify.com/v1/",
      headers: {
        Authorization: `${SpotifyAPI.userCredencials.tokenType} ${SpotifyAPI.userCredencials.acessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  static get userCredencials(): UserCredencials {
    const credencials = Cookies.get("user-credencials");
    if (credencials) {
      return JSON.parse(credencials);
    }
    return {} as UserCredencials;
  }

  async playCurrentPlayBack() {
    await this.axios.put("me/player", {
      device_ids: [Cookies.get("device-id")],
      play: true,
    });
  }

  async getUserInfo() {
    const response = await axios.get("me");
    console.log(response);
  }

  async playUri(uri: string) {
    try {
      await this.axios.put(
        `me/player/play?device_id=${Cookies.get("device-id")}`,
        {
          uris: [uri]
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async playContext(contextUri: string, offset?: number) {
    let body = {};
    if (offset) {
      body = {
        context_uri: contextUri,
        offset: {
          position: offset,
        }
      };
    } else {
      body = {
        context_uri: contextUri,
      }
    }

    try {
      await this.axios.put(
        `me/player/play?device_id=${Cookies.get("device-id")}`,
        body
      );
    } catch (err) {
      console.log(err);
    }
  }

  async playTrackInAContext(uri: string, ContextUri: string) {
    try {
      await this.axios.put(
        `me/player/play?device_id=${Cookies.get("device-id")}`,
        {
          context_uri: ContextUri,
          offset: {
            uri: uri
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async setShuffle(value: boolean) {
    try {
      const response = await this.axios.put(
        `/me/player/shuffle?state=${value}`
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
  async setRepeatMode(value: number) {
    let newState = "off";
    if (value === 1) {
      newState = "context";
    } else if (value === 2) {
      newState = "track";
    }
    try {
      const response = await this.axios.put(
        `me/player/repeat?state=${newState}`
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  async getCurrentUserPlayLists(limit = 20, offset = 0): Promise<Array<PlaylistObject>> {
    try {
      const response = await this.axios.get(
        `/me/playlists?limit=${limit}&offset=${offset}`
      );
      return new Promise((resolve, reject) => {
        resolve(response.data.items);
      });
    } catch (err) {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

  async getUserTopArtists(timeRange: TimeRange, limit: number, offset: number): Promise<Array<ArtistObject>> {
    try {
      const response = await this.axios.get(
        `/me/top/artists?time_range=${TimeRange[timeRange]}&limit=${limit}&offset=${offset}`
      );
      return new Promise((resolve, reject) => {
        resolve(response.data.items);
      });
    } catch (err) {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

  async getUserTopTracks(timeRange: TimeRange, limit = 10, offset = 0): Promise<Array<TrackObject>> {
    try {
      const response = await this.axios.get(
        `/me/top/tracks?time_range=${TimeRange[timeRange]}&limit=${limit}&offset=${offset}`
      );
      return new Promise((resolve, reject) => {
        resolve(response.data.items);
      });
    } catch (err) {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

  async getUserSavedAlbums(limit = 20, offset = 0): Promise<Array<AlbumObject>> {
    try {
      const response = await this.axios.get(
        `me/albums?limit=${limit}&offset=${offset}`
      );
      return new Promise((resolve, reject) => {
        resolve(response.data.items);
      });
    } catch (err) {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

  async getUserSavedTracks(limit = 20, offset = 0): Promise<Array<TrackObject>> {
    try {
      const response = await this.axios.get(
        `me/tracks?limit=${limit}&offset=${offset}`
      );
      return new Promise((resolve, reject) => {
        resolve(response.data.items);
      });
    }
    catch (err) {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

  async getUserFollowedArtists(limit = 20, after?: string): Promise<Array<ArtistObject>> {
    try {
      const response = await this.axios.get(
        `me/following?type=artist&limit=${limit}`
      ); return new Promise((resolve, reject) => {
        resolve(response.data.artists.items);
      });
    }
    catch (err) {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

  async getUserRecentlyPlayedTracks(limit = 20): Promise<Array<PlayHistoryObject>> {
    try {
      const response = await this.axios.get(
        `me/player/recently-played?limit=${limit}`
      );
      return new Promise((resolve, reject) => {
        resolve(response.data.items);
      });
    }
    catch (err) {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

  async getPlayList(id: string): Promise<PlaylistObject> {
    try {
      const response = await this.axios.get(
        `playlists/${id}`
      ); return new Promise((resolve, reject) => {
        resolve(response.data);
      });
    }

    catch (err) {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }

  async getRefreshedToken(clientId: string) {
    const params = new URLSearchParams();
    const refreshToken = SpotifyAPI.userCredencials.refreshToken;
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);
    params.append("client_id", clientId);
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const data = response.data;
      const userCredencials: UserCredencials = {
        acessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        createdAt: Date.now(),
        scope: data.scope,
      };
      return userCredencials;
    } catch (err) {
      Cookies.set("auth-status", "failed");
      console.log(err);
    }
  }

  static async fetchUserCredencials(
    clientID: string,
    code: string,
    codeVerifier: string,
    redirectURL: string
  ) {
    const params = new URLSearchParams();
    params.append("client_id", clientID);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectURL);
    params.append("code_verifier", codeVerifier);
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const data = response.data;
      const userCredencials: UserCredencials = {
        acessToken: data.access_token,
        expiresIn: data.expires_in,
        createdAt: Date.now(), 
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        scope: data.scope,
      };
      return userCredencials;
    } catch (err) {
      Cookies.set("auth-status", "failed");
      console.log(err);
      return null;
    }
  }

  static async authenticate() {
    const codeVerifier = generateRandomString();
    Cookies.set("code-verifier", codeVerifier);
    const codeChallenge = await generatecodeChallenge(codeVerifier);
    const requestURL =
      `https://accounts.spotify.com/authorize?` +
      `response_type=code` +
      `&client_id=${SpotifyAPI.clientID}` +
      `&redirect_uri=${SpotifyAPI.redirectURL}` +
      `&scope=${SpotifyAPI.scopes.join("%20")}` +
      `&state=e21392da45dbf4` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;

    Cookies.set("auth-status", "in progress");
    window.open(requestURL, "_self");
  }
}

export const spotifyAPI = new SpotifyAPI();