import { useState, useEffect, useContext } from 'react';
import styles from "../styles/pages/Home.module.scss";
import SongBar from "../components/SongBar";
import LeftBar from "../components/LeftBar";
import HomeSectionCard from "../components/HomeSectionCard";
import { UserContext } from '../contexts/user';

export default function Home() {
  const {
    playLists,
    followedArtists
  } = useContext(UserContext);

  return (
    <>
      <SongBar />
      <LeftBar />

      <main className={styles.homeContainer}>
        <div className={styles.homeWrapper}>
          <section className={styles.carouselContainer}>
            
          </section>
          <section className={styles.homeSection}>
            <h1>Your Playlists</h1>
            <ul>
              {
                playLists.slice(0, 5).map(playList =>
                  <HomeSectionCard
                    title={playList.name}
                    subtitle={playList.owner.display_name}
                    coverURL={playList.images[0].url}
                  />)
              }
            </ul>
          </section>
          <section className={styles.homeSection}>
            <h1>Followed Artists</h1>
            <ul>
              {
                followedArtists.slice(0, 5).map(artist =>
                  <HomeSectionCard
                    title={artist.name}
                    subtitle=""
                    coverURL={artist.images[0].url}
                  />)
              }
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
