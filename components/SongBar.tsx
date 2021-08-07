import { useContext, useEffect } from "react";
import Link from "next/link";
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
import { SongBarContext } from "../contexts/songBar";
export default function SongBar() {
  

  const {
    currentSong,
    currentArtist,
    albumImgURL,
    shuffle,
    repeatMode,
    changeVolume,
    isPaused,
    togglePlay,
    nextSong,
    previousSong,
    toggleShuffle,
    changeRepeatMode,
    currentSongDuration,
    currentSongPosition,
    setCurrentSongPosition,
    seekToPosition
  } = useContext(SongBarContext);

  useEffect(() => {
    let timeOut;
    if (!isPaused && currentSongDuration > currentSongPosition) {
      timeOut = setTimeout(() => {
        setCurrentSongPosition(currentSongPosition + 1000);
      }, 1000);
    }
    return () => {
      clearTimeout(timeOut);
    }
  }, [isPaused, currentSongPosition, currentSongDuration]);


  function handleChangeVolume(event: React.ChangeEvent<HTMLInputElement>) {
    changeVolume(parseInt(event.currentTarget.value) / 100);
    console.log(event.currentTarget.value);
  }
  function handleChangeSongPosition(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.currentTarget.value);
    seekToPosition(parseFloat(event.currentTarget.value));
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

  function handleToggleShuffle() {
    toggleShuffle();
  }

  function handleChangeRepeatMode() {
    changeRepeatMode();
  }

  return (
    <>
      <div className={styles.songBarContainer}>
        <main>
          <div className={styles.songInfo}>
            {albumImgURL ? <img src={albumImgURL} alt="album-cover" /> : <></>}
            <div>
              <h3>{currentSong}</h3>
              <h4>{currentArtist}</h4>
            </div>
          </div>
          <div className={styles.centerControlls}>
            <div
              className={`${styles.iconButton} ${shuffle ? "active" : ""
                }`}
              onClick={handleToggleShuffle}
            >
              <Shuffle />
            </div>
            <div className={styles.iconButton} onClick={handlePreviousSong}>
              <SkipPrevious />
            </div>
            <div className={styles.iconButton} onClick={handleTogglePlay}>
              {isPaused ? <PlayCircleOutline /> : <PauseCircleOutline />}
            </div>
            <div className={styles.iconButton} onClick={handleNextSong}>
              <SkipNext />
            </div>
            <div
              className={`${styles.iconButton} ${repeatMode != 0 ? "active" : ""
                }`}
              onClick={handleChangeRepeatMode}
            >
              <Replay />
              {repeatMode === 1 ? <span>¹</span> : <></>}
              {repeatMode === 2 ? <span>²</span> : <></>}
            </div>
          </div>
          <div className={styles.rightControlls}>
            <VolumeUp />
            <input
              type="range"
              min="0"
              max="100"
              className={styles.slider}
              onChange={handleChangeVolume}
            />
            <Link href="/fullscreen" >
              <div className={styles.iconButton}>
                <Fullscreen />
              </div>
            </Link>
          </div>
        </main>
        <div className={styles.songProgress}>
          <input
            type="range"
            min="0"
            max={currentSongDuration}
            value={currentSongPosition}
            onChange={handleChangeSongPosition}
            step="0.1"
            className={styles.slider}
          />
        </div>
      </div>
    </>
  );
}
