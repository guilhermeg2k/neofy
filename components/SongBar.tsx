import styles from "../styles/components/SongBar.module.scss";
export default function SongBar() {
  return (
    <div className={styles.songBarContainer}>
      <main>
        <div className={styles.songInfo}>
          <img
            src="https://i.scdn.co/image/ab67616d00004851a9f6c04ba168640b48aa5795"
            alt="album-cover"
          />
          <div>
            <h3>idontwannabeyouanymore</h3>
            <h4>Billie Eilish</h4>
          </div>
        </div>
        <div className={styles.songProgress}>
          <div>
            <input type="range" min="1" max="100" default="55" />
            <span>1:33~3:23</span>
          </div>
          <div></div>
        </div>
      </main>
    </div>
  );
}
