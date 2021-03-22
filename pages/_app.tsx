import "../styles/globals.scss";
import { useEffect, useState } from "react";
import { SpotifySDKProvider } from "../contexts/spotifysdk";
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
        <SpotifySDKProvider>
          <Component {...pageProps} />
        </SpotifySDKProvider>
      </>
    );
  } else {
    return <p>Redirecting to spotify Login page...</p>;
  }
}

export default MyApp;
