import "../styles/globals.scss";
import { useEffect, useState } from "react";
import { SongBarProvider } from "../contexts/songBar";
import { UserProvider } from "../contexts/user";
import { SpotifyAPI } from "../services/spotifyapi";
import { initSpotifySDK } from "../services/spotifysdk";
import Cookies from "js-cookie";

initSpotifySDK();

function MyApp({ Component, pageProps }) {
  
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = Cookies.get("auth-status");
    if (authStatus === "failed" || !authStatus) {
      SpotifyAPI.authenticate();
    } else {
      setAuthenticated(true);
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
