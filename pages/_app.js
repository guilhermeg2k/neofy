import "../styles/globals.scss";
import { SpotifySDKProvider } from "../contexts/spotifysdk";
import { SpotifyAPIProvider } from "../contexts/spotifyapi";
function MyApp({ Component, pageProps }) {
  return (
    <SpotifyAPIProvider>
      <SpotifySDKProvider>
        <Component {...pageProps} />{" "}
      </SpotifySDKProvider>
    </SpotifyAPIProvider>
  );
}

export default MyApp;
