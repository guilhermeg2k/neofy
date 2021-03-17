import "../styles/globals.scss";
import { SpotifySDKProvider } from "../contexts/spotifysdk";

function MyApp({ Component, pageProps }) {
  return (
    <SpotifySDKProvider>
      <Component {...pageProps} />{" "}
    </SpotifySDKProvider>
  );
}

export default MyApp;
