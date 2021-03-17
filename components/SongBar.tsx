import { useContext } from "react";
import styles from "../styles/components/SongBar.module.scss";
import {
  Shuffle,
  SkipPrevious,
  SkipNext,
  PlayCircleOutline,
  Replay,
  VolumeUp,
  Fullscreen,
  PauseCircleOutline,
} from "@material-ui/icons";

import { SpotifySDKContext } from "../contexts/spotifysdk";

export default function SongBar() {
  const {
    currentSong,
    currentArtist,
    albumImgURL,
    shuffle,
    repeatMode,
    changeVolume,
    paused,
    togglePlay,
    nextSong,
    previousSong,
  } = useContext(SpotifySDKContext);

  function handleChangeVolume(event: React.ChangeEvent<HTMLInputElement>) {
    changeVolume(parseInt(event.currentTarget.value) / 100);
    console.log(event.currentTarget.value);
  }

  function handleTogglePlay() {
    togglePlay();
  }

  function handleNextSong() {
    nextSong();
  }

  function handlePreviousSong() {
    previousSong();
  }

  return (
    <div className={styles.songBarContainer}>
      <main>
        <div className={styles.songInfo}>
          <img src={albumImgURL} alt="album-cover" />
          <div>
            <h3>{currentSong}</h3>
            <h4>{currentArtist}</h4>
          </div>
        </div>
        <div className={styles.songProgress}>
          <div>
            <input type="range" min="1" max="100" className={styles.slider} />
            <span>1:33~3:23</span>
          </div>
          <div>
            <div
              className={`${styles.iconButton} ${shuffle ? styles.active : ""}`}
            >
              <Shuffle />
            </div>
            <div className={styles.iconButton} onClick={handlePreviousSong}>
              <SkipPrevious />
            </div>
            <div className={styles.iconButton} onClick={handleTogglePlay}>
              {paused ? <PlayCircleOutline /> : <PauseCircleOutline />}
            </div>
            <div className={styles.iconButton} onClick={handleNextSong}>
              <SkipNext />
            </div>
            <div
              className={`${styles.iconButton} ${
                repeatMode !== 0 ? styles.active : ""
              }`}
            >
              <Replay />
            </div>
          </div>
        </div>
        <div className={styles.rightControlls}>
          <VolumeUp />
          <input
            type="range"
            min="1"
            max="100"
            className={styles.slider}
            onChange={handleChangeVolume}
          />
          <div className={styles.iconButton}>
            <Fullscreen />
          </div>
        </div>
      </main>
    </div>
  );
}
