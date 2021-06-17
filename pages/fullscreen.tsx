import { useContext } from "react";
import styles from "../styles/pages/FullScreen.module.scss";
import Link from "next/link";
import {
  FullscreenExit
} from "@material-ui/icons";
import { SpotifyContext } from "../contexts/spotify";
import FullScreenSongBar from "../components/FullScreenSongBar";
export default function Fullscreen() {
  const {
    currentSong,
    currentArtist,
    albumLargeImgURL,
    currentContext
  } = useContext(SpotifyContext);
  return (
    <div className={styles.fullscreenContainer}>
      <div className={styles.fullscreenWrapper}>
        <header>
          <div>
            <h1>
              PLAYING FROM {currentContext.type}
            </h1>
            <h1 className="active">
              {currentContext.name}
            </h1>
          </div>
          <Link href="/">
            <div className={styles.iconButton}>
              <FullscreenExit />
            </div>
          </Link>
        </header>
        <main>
          <div>
            <img src={albumLargeImgURL} />
          </div>
          <div>
            <h1 className="active">{currentSong}</h1>
            <h1>{currentArtist}</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sagittis vitae et leo duis ut diam quam nulla. Nec nam aliquam sem et tortor consequat id. Morbi quis commodo odio aenean sed adipiscing diam. Ac turpis egestas integer eget aliquet nibh. Nunc scelerisque viverra mauris in aliquam sem. Aliquet enim tortor at auctor urna nunc. Et molestie ac feugiat sed lectus vestibulum. Adipiscing elit ut aliquam purus sit amet luctus venenatis. Enim sed faucibus turpis in eu. Varius duis at consectetur lorem donec.
              Ornare massa eget egestas purus viverra. Sed nisi lacus sed viverra tellus in hac. Purus gravida quis blandit turpis. Nibh mauris cursus mattis molestie a iaculis at erat. Pellentesque pulvinar pellentesque habitant morbi tristique. In pellentesque massa placerat duis ultricies lacus sed turpis tincidunt. Massa tincidunt dui ut ornare. Bibendum ut tristique et egestas quis ipsum suspendisse ultrices gravida. Nunc mattis enim ut tellus elementum sagittis. Pharetra et ultrices neque ornare aenean euismod. Tempus imperdiet nulla malesuada pellentesque elit eget gravida. Sit amet massa vitae tortor condimentum.
            </p>
          </div>
        </main>
      </div>
      <FullScreenSongBar />
    </div>
  );
}