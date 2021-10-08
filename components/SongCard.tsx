import { TrackObject } from "../services/spotifyapi";
import styles from "../styles/components/SongCard.module.scss";

interface SongCardProps {
  song: TrackObject;
  pos: number;
}

export default function SongCard({ song, pos }: SongCardProps) {
  return (
    <div className={styles.songCardWrapper}>
      <div className={styles.title}>
        <span>{pos+1}</span>
        <div className={styles.imageWrapper}>
          <img src={song.album.images[0].url} alt="song album cover"/>
        </div>
        <div className={styles.name}>
          <span>{song.name}</span>
          <span>{song.artists[0].name}</span>
        </div>
      </div>
      <div className={styles.album}>
        {song.album.name}
      </div>
      <div className={styles.added}>
        16 days ago
      </div>
      <div className={styles.options}>
        <span>d)</span>
        <span>:</span>
      </div>
    </div>
  )
}