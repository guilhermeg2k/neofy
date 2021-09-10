import { useEffect } from "react";
import { useRouter } from "next/router";
import { spotifyAPI, SpotifyAPI } from "../services/spotifyapi";
import Cookies from "js-cookie";

export default function Auth() {
  const router = useRouter();
  const { code, state, error } = router.query;
  const codeVerifier = Cookies.get("code-verifier");

  useEffect(() => {
    async function fetchCredencials() {
      const userCredencials = await SpotifyAPI.fetchUserCredencials(
        SpotifyAPI.clientID,
        code as string,
        codeVerifier,
        SpotifyAPI.redirectURL
      );
      Cookies.set("user-credencials", JSON.stringify(userCredencials));
      Cookies.set("auth-status", "success");
      window.open("/", "_self");
    }

    if (!router.isReady) {
      return;
    }

    if (!error) {
      fetchCredencials();
    } else {
      Cookies.set("auth-status", "failed");
    }
  }, [router.isReady]);

  return <p>Redirecting ...</p>;
}
