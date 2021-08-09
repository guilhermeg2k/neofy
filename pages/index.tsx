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
  const spotifyAPI = new SpotifyAPI();
  const [recentlyPlayedTracks, setRecentylePlayedTracks] = useState(Array<PlayHistoryObject>());
  const [selectedItem, setSelectedItem] = useState({});

  const {
    playlists: playLists,
    followedArtists,
    savedAlbums,
    suggestions,
    getUserRecentlyPlayedTracks
  } = useContext(UserContext);

  console.log(suggestions);
  
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
