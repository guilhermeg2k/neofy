import { useState } from 'react';
import styles from "../styles/components/LeftBar.module.scss";
import {
  Home,
  Search,
  LibraryMusic,
  Audiotrack,
  QueueMusic,
  Album
} from "@material-ui/icons";
export default function LeftBar() {
  const [hideLabel, setHideLabel] = useState(true);
  return (
    <nav className={styles.leftBarContainer}>
      <div className={styles.leftBarWrapper}>
        <div
          className={styles.iconButton}
          onMouseEnter={() => setHideLabel(false)}
          onMouseLeave={() => setHideLabel(true)}
        >
          <Home />
          <span className={hideLabel ? "hidden" : ""}>Home</span>
        </div>
        <div 
          className={styles.iconButton} 
          onMouseEnter={() => setHideLabel(false)} 
          onMouseLeave={() => setHideLabel(true)}
        >
          <Search />
          <span className={hideLabel ? "hidden" : ""}>Search</span>
        </div>
        <div 
          className={styles.iconButton} 
          onMouseEnter={() => setHideLabel(false)} 
          onMouseLeave={() => setHideLabel(true)}
        >
          <LibraryMusic />
          <span className={hideLabel ? "hidden" : ""}>Library</span>
        </div>
        <div 
          className={styles.iconButton} 
          onMouseEnter={() => setHideLabel(false)} 
          onMouseLeave={() => setHideLabel(true)}
        >
          <Audiotrack />
          <span className={hideLabel ? "hidden" : ""}>Songs</span>
        </div>
        <div 
          className={styles.iconButton} 
          onMouseEnter={() => setHideLabel(false)} 
          onMouseLeave={() => setHideLabel(true)}
        >
          <QueueMusic />
          <span className={hideLabel ? "hidden" : ""}>Playlists</span>
        </div>
        <div 
          className={styles.iconButton} 
          onMouseEnter={() => setHideLabel(false)} 
          onMouseLeave={() => setHideLabel(true)}
        >
          <Album />
          <span className={hideLabel ? "hidden" : ""}>Albums</span>
        </div>
      </div>
    </nav>
  )
}