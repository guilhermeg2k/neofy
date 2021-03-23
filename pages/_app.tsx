import "../styles/globals.scss";
import { useEffect, useState } from "react";
import { SpotifyProvider } from "../contexts/spotify";
import { SpotifyAPI } from "../services/spotifyapi";
import { initSpotifySDK } from "../services/spotifysdk";
import Cookies from "js-cookie";

function MyApp({ Component, pageProps }) {
  const [authenticated, setAuthenticated] = useState(false);

  initSpotifySDK();

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
        <SpotifyProvider>
          <Component {...pageProps} />
        </SpotifyProvider>
      </>
    );
  } else {
    return <p>Redirecting to spotify Login page...</p>;
  }
}

export default MyApp;
