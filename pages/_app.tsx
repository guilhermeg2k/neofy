import "../styles/globals.scss";
import { useEffect, useState } from "react";
import { SpotifySDKProvider } from "../contexts/spotifysdk";
import { authenticate } from "../services/spotifyapi";
import Cookies from "js-cookie";

function MyApp({ Component, pageProps }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = Cookies.get("auth-status");
    if (authStatus === "failed" || !authStatus) {
      authenticate();
    } else {
      setAuthenticated(true);
    }
  }, []);

  if (authenticated) {
    return (
      <SpotifySDKProvider>
        <Component {...pageProps} />
      </SpotifySDKProvider>
    );
  } else {
    return <p>Redirecting to spotify Login page...</p>;
  }
}

export default MyApp;
