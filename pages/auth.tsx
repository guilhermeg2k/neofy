import { useEffect } from "react";
import { useRouter } from "next/router";
import { SpotifyAPI, initSpotifyAPI } from "../services/spotifyapi";
import Cookies from "js-cookie";

export default function Auth() {
  const router = useRouter();
  const { code, state, error } = router.query;

  const codeVerifier = Cookies.get("code-verifier");

  useEffect(() => {
    if (!router.isReady) return;
    if (!error) {
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
      fetchCredencials();
    } else {
      Cookies.set("auth-status", "failed");
    }
  }, [router.isReady]);

  return <p>Redirecting ...</p>;
}
