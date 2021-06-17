import { useContext, useEffect } from "react";
import styles from "../styles/components/FullScreenSongBar.module.scss";
import {
  Shuffle,
  SkipPrevious,
  SkipNext,
  PlayCircleOutline,
  Replay,
  PauseCircleOutline,
} from "@material-ui/icons";
import { SpotifyContext } from "../contexts/spotify";
export default function FullScreenSongBar() {
  const {
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
  } = useContext(SpotifyContext);

  useEffect(() => {
    let timeOut;
    if (!isPaused && currentSongDuration > currentSongPosition) {
      timeOut = setTimeout(() => {
        setCurrentSongPosition(currentSongPosition + 150);
      }, 100);
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
        <main>
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
        </main>
        
      </div>
    </>
  );
}
