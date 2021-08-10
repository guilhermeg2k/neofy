import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/user';
import { PlayHistoryObject } from '../services/spotifyapi';
import { SpotifyAPI } from "../services/spotifyapi";
import styles from "../styles/pages/Home.module.scss";
import SongBar from "../components/SongBar";
import LeftBar from "../components/LeftBar";
import HomeSectionCard from "../components/HomeSectionsCard";
import HomeMainCard from "../components/HomeMainCard";
import SuggestionCard from '../components/SuggestionCard';

export default function Home() {
  const {
    playlists,
    followedArtists,
    suggestions,
  } = useContext(UserContext);

  return (
    <>
      <SongBar />
      <LeftBar />

      <main className={styles.homeContainer}>
        <div className={styles.homeWrapper}>
          <section className={styles.homeMainContainer}>
            {suggestions?.length > 0 ?
              <HomeMainCard
                suggestion={suggestions[0]}
              />
              : <></>
            }
            <div className={styles.suggestionsContainer}>
              {
                suggestions?.length > 0 ?
                  suggestions.slice(1).map(suggestion =>
                    <SuggestionCard
                      suggestion={suggestion}
                    />)
                  : <></>
              }
            </div>
          </section>
          <section className={styles.homeSection}>
            <h1>Your Playlists</h1>
            <ul>
              {
                playlists.slice(0, 5).map(playlist =>
                  <HomeSectionCard
                    sectionData = {{
                      item: playlist,
                      type: "playlist"
                    }}
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
                    sectionData = {{
                      item: artist,
                      type: "artist"
                    }}
                  />)
              }
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
