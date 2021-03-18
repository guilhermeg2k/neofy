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

interface UserInfo {
  displayName: string;
  email: string;
  id: string;
  imageURL: string;
  product: string;
  type: string;
}

export const clientID = "eca09370790043d6a575e301b2da83ca";
export const redirectURL = "http://localhost:3000/auth";
export const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-follow-modify",
];

const spotifyAPI = axios.create({
  baseURL: "https://api.spotify.com/v1/",
  headers: {
    Authorization: `${getUserCredencials().tokenType} ${
      getUserCredencials().acessToken
    }`,
  },
});

function getUserCredencials(): UserCredencials {
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
    })
    .catch((err) => {
      Cookies.set("auth-status", "failed");
      console.log(err);
    });
}

export function getUserInfo() {
  spotifyAPI.get("me").then((response) => {
    console.log(response.data);
  });
}

async function generatecodeChallenge(codeVerifier: string) {
  let hashed = await sha256(codeVerifier);
  let base64encoded = base64urlencode(hashed);
  return base64encoded;
}
