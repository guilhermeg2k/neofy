import "../styles/globals.scss";
import { useEffect, useState } from "react";
import { SongBarProvider } from "../contexts/songBar";
import { UserProvider } from "../contexts/user";
import { spotifyAPI, SpotifyAPI } from "../services/spotifyapi";
import { initSpotifySDK } from "../services/spotifysdk";
import Cookies from "js-cookie";
import { setInterval } from "timers";

initSpotifySDK();

function MyApp({ Component, pageProps }) {
  const [authenticated, setAuthenticated] = useState(false);

  function refreshToken() {
    const userCredencials = spotifyAPI.getRefreshedToken(SpotifyAPI.clientID);
    Cookies.set("user-credencials", JSON.stringify(userCredencials));
    Cookies.set("auth-status", "success");
  }

  useEffect(() => {
    const authStatus = Cookies.get("auth-status");
    if (authStatus === "failed" || !authStatus) {
      SpotifyAPI.authenticate();
    } else {
      setAuthenticated(true);
      const userCredencials = SpotifyAPI.userCredencials;

      if ((Date.now() - userCredencials.createdAt) > (55 * 60000)) {
        refreshToken();
        setInterval(() => {
          if ((Date.now() - userCredencials.createdAt) > (55 * 60000)) {
            refreshToken();
          }
        });
      }
    }
  }, []);

  if (authenticated) {
    return (
      <>
        <SongBarProvider>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </SongBarProvider>
      </>
    );
  } else {
    return <p>Redirecting to spotify authentication page...</p>;
  }
}

export default MyApp;
