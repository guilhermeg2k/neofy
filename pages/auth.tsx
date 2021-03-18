import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  fetchUserCredencials,
  clientID,
  redirectURL,
} from "../services/spotifyapi";
import Cookies from "js-cookie";

export default function Auth() {
  const router = useRouter();
  const { code, state, error } = router.query;

  const codeVerifier = Cookies.get("code-verifier");

  useEffect(() => {
    if (!router.isReady) return;
    if (!error) {
      fetchUserCredencials(clientID, code as string, codeVerifier, redirectURL);
      window.open("/", "_self");
    } else {
      console.log(error);
      Cookies.set("auth-status", "failed");
    }
  }, [router.isReady]);

  return <p>Redirecting ...</p>;
}
