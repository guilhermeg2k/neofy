import "../styles/globals.scss";
import { useEffect, useState } from "react";
import { SongBarProvider } from "../contexts/songBar";
import { UserProvider } from "../contexts/user";
import { spotifyAPI, SpotifyAPI } from "../services/spotifyapi";
import { initSpotifySDK } from "../services/spotifysdk";
import Cookies from "js-cookie";
import { setInterval } from "timers";
import { isObjectEmpty } from "../utils/";

function MyApp({ Component, pageProps }) {
  const [authenticated, setAuthenticated] = useState(false);

  async function refreshToken() {
    try {
      const userCredencials = await spotifyAPI.getRefreshedToken(SpotifyAPI.clientID);
      if (!isObjectEmpty(userCredencials)) {
        Cookies.set("user-credencials", JSON.stringify(userCredencials));
        Cookies.set("auth-status", "success");
        spotifyAPI.syncApiToken();
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    initSpotifySDK();
    const authStatus = Cookies.get("auth-status");
    if (authStatus === "failed" || !authStatus) {
      SpotifyAPI.authenticate();
    } else {
      setAuthenticated(true);
      const userCredencials = SpotifyAPI.userCredencials;

      if ((Date.now() - userCredencials.createdAt) > (55 * 60000)) {
        refreshToken().then(() => {
          window.location.reload();
        });
      }

      setInterval(() => {
        if ((Date.now() - userCredencials.createdAt) > (55 * 60000)) {
          refreshToken();
        }
      }, 5 * 60000);
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
