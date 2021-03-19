import axios from "axios";
import Cookies from "js-cookie";
import { generateRandomString, sha256, base64urlencode } from "../utils";

export interface UserCredencials {
  acessToken: string;
  tokenType: string;
  scope: string;
  expiresIn: string;
  refreshToken: string;
}

export const clientID = "eca09370790043d6a575e301b2da83ca";
export const redirectURL = "http://localhost:3000/auth";
export const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-follow-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
];

const spotifyAPI = axios.create({
  baseURL: "https://api.spotify.com/v1/",
  headers: {
    Authorization: `${getUserCredencials().tokenType} ${
      getUserCredencials().acessToken
    }`,
    "Content-Type": "application/json",
  },
});

export function getUserCredencials(): UserCredencials {
  const credencials = Cookies.get("user-credencials");
  if (credencials) {
    return JSON.parse(credencials);
  }
  return {} as UserCredencials;
}

export async function authenticate() {
  const codeVerifier = generateRandomString();
  Cookies.set("code-verifier", codeVerifier);
  const codeChallenge = await generatecodeChallenge(codeVerifier);
  const requestURL =
    `https://accounts.spotify.com/authorize?` +
    `response_type=code` +
    `&client_id=${clientID}` +
    `&redirect_uri=${redirectURL}` +
    `&scope=${scopes.join("%20")}` +
    `&state=e21392da45dbf4` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  Cookies.set("auth-status", "in progress");
  window.open(requestURL, "_self");
}

export function fetchUserCredencials(
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
  return new Promise((resolve, reject) => {
    axios
      .post("https://accounts.spotify.com/api/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((result) => {
        const data = result.data;
        const userCredencials: UserCredencials = {
          acessToken: data.access_token,
          expiresIn: data.expires_in,
          refreshToken: data.refresh_token,
          tokenType: data.token_type,
          scope: data.scope,
        };
        Cookies.set("user-credencials", JSON.stringify(userCredencials));
        Cookies.set("auth-status", "success");
        resolve("done");
      })
      .catch((err) => {
        Cookies.set("auth-status", "failed");
        reject();
        console.log(err);
      });
  });
}

export async function playCurrentPlayBack() {
  await spotifyAPI.put("me/player", {
    device_ids: [Cookies.get("device-id")],
    play: true,
  });
}

export function getUserInfo() {
  spotifyAPI.get("me").then((response) => {
    console.log(response.data);
  });
}

export function playURI(spotifyURI: string) {
  spotifyAPI.put(`me/player/play?device_id=${Cookies.get("device-id")}`, {
    uris: [spotifyURI],
  });
}

async function generatecodeChallenge(codeVerifier: string) {
  let hashed = await sha256(codeVerifier);
  let base64encoded = base64urlencode(hashed);
  return base64encoded;
}
