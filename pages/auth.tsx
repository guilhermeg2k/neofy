import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { SpotifyAPIContext } from "../contexts/spotifyapi";
import axios from "axios";
import Cookies from "js-cookie";

interface UserCredencials {
  AcessToken: string;
  TokenType: string;
  Scope: string;
  ExpiresIn: string;
  RefreshToken: string;
}

export default function Auth() {
  const router = useRouter();
  const { code, state, error } = router.query;

  const codeVerifier = Cookies.get("code-verifier");
  const clientID = "eca09370790043d6a575e301b2da83ca";
  const redirectURL = "http://localhost:3000/auth";

  useEffect(() => {
    if (!router.isReady) return;
    if (!error) {
      Cookies.set("authenticated", "true");
      getUserCredencials(clientID, code, codeVerifier, redirectURL);
    } else {
      Cookies.set("authenticated", "false");
    }
  }, [router.isReady]);

  function getUserCredencials(
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
    params.forEach((param, key) => console.log(key + param));
    axios
      .post("https://accounts.spotify.com/api/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <p>
      {" "}
      {code} {state}{" "}
    </p>
  );
}
