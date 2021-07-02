import { useState, useEffect, useContext } from 'react';
import styles from "../styles/pages/Home.module.scss";
import SongBar from "../components/SongBar";
import LeftBar from "../components/LeftBar";
import HomeCard from "../components/HomeCard";
import HomeCarousel from '../components/HomeCarousel';
import { SpotifyContext } from "../contexts/spotify";
import { ArtistObject, PlaylistObject } from '../services/spotifyapi';

export default function Home() {
  const {
    getCurrentUserPlayLists,
    getUserTopArtists
  } = useContext(SpotifyContext);

  const [playLists, setPlayLists] = useState(Array<PlaylistObject>());
  const [artists, setArtists] = useState(Array<ArtistObject>());

  useEffect(() => {
    async function fetchAPI() {
      setPlayLists(await getCurrentUserPlayLists());
      setArtists(await getUserTopArtists())
    }
    fetchAPI();
  }, []);

  return (
    <>
      <SongBar />
      <LeftBar />

      <main className={styles.homeContainer}>
        <div className={styles.homeWrapper}>
          <section className={styles.carouselContainer}>
            <HomeCarousel />
          </section>
          <section className={styles.homeSection}>
            <h1>Your Playlists</h1>
            <ul>
              {
                playLists.slice(0, 5).map(playList =>
                  <HomeCard
                    title={playList.name}
                    subtitle={playList.owner.display_name}
                    coverURL={playList.images[0].url}
                  />)
              }
            </ul>
          </section>
          <section className={styles.homeSection}>
            <h1>Your Top Artists</h1>
            <ul>
              {
                artists.slice(0, 5).map(artist =>
                  <HomeCard
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
