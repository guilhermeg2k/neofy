import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import base64url from "base64url";
import { sha256 } from "js-sha256";

interface SpotifyAPIProviderProps {
  children: ReactNode;
}

interface SpotifyAPIContextData {}

export const SpotifyAPIContext = createContext({} as SpotifyAPIContextData);

export function SpotifyAPIProvider({ children }: SpotifyAPIProviderProps) {
  useEffect(() => {
    if (Cookies.get("authenticated") !== "true") {
      console.log("monki alado");
      Cookies.set("authenticated", "true");
      authenticate();
    }
  }, []);

  async function authenticate() {
    const codeVerifier = generateRandomString();
    Cookies.set("code-verifier", codeVerifier);
    const codeChallenge = await generatecodeChallenge(codeVerifier);
    const clientId = "eca09370790043d6a575e301b2da83ca";
    const redirectURL = "http://localhost:3000/auth";
    const requestURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectURL}&scope=user-follow-modify&state=e21392da45dbf4&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    window.open(requestURL, "_self");
  }

  async function generatecodeChallenge(v) {
    let hashed = await sha256(v);
    let base64encoded = base64urlencode(hashed);
    return base64encoded;
  }

  function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  }

  function base64urlencode(a) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  function generateRandomString(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  return (
    <SpotifyAPIContext.Provider value={{}}>
      {children}
    </SpotifyAPIContext.Provider>
  );
}
