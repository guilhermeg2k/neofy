import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { generateRandomString, generatecodeChallenge } from "../utils";

export interface UserCredencials {
  acessToken: string;
  tokenType: string;
  scope: string;
  expiresIn: string;
  refreshToken: string;
}

export interface ExternalUrlObject{
  spotify: string;
}

export interface FollowersObject{
  href: string;
  total: number;
}

export interface PublicUserObject{
  display_name: string;
  external_url: ExternalUrlObject;
  followers: FollowersObject;
  href: string;
  id: string;
  images: Array<Image>;
  type: string;
  uri: string;
}

//TODO: Create the TrackObject
export interface PlaylistTrackObject{
  added_at: Date;
  added_by: PublicUserObject;
  is_local: boolean;
  track: string;
}

export interface PlaylistObject{
  collaborative: boolean;
  description: string;
  id: string;
  external_urls: ExternalUrlObject;
  followers: FollowersObject;
  images: Array<Image>;
  name: string;
  owner: PublicUserObject;
  public: boolean;
  snapshot_id: string;
  tracks: Array<PlaylistTrackObject>;
  type: string;
  uri: string;
}

export interface Image{
  height: number;
  url: string;
  width: string;
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
    "playlist-read-collaborative"
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

  async playURI(spotifyURI: string) {
    const response = await this.axios.put(
      `me/player/play?device_id=${Cookies.get("device-id")}`,
      {
        uris: [spotifyURI],
      }
    );
    console.log(response);
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

  async getCurrentUserPlayLists(): Promise<Array<PlaylistObject>>{
    try {
      const response = await this.axios.get(
        `/me/playlists`
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
