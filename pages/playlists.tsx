import React, { useContext } from "react";
import { UserContext } from '../contexts/user';
import styles from "../styles/pages/Playlists.module.scss";

import LeftBar from "../components/LeftBar";
import SongBar from "../components/SongBar";
import HomeSectionCard from "../components/HomeSectionsCard";

export default function Playlists() {
  const {
    playlists
  } = useContext(UserContext);
  console.log(playlists);
  return (
    <div>
      <SongBar />
      <LeftBar />
      <main className={styles.playlistsContainer}>
        <div className={styles.playlistsWrapper}>
          <h1>Playlists</h1>
          <ul>
            {
              playlists.map(playlist =>
                <HomeSectionCard
                  sectionData={{
                    item: playlist,
                    type: "playlist"
                  }}
                />)
            }
          </ul>
        </div>
      </main>
    </div>
  )
}