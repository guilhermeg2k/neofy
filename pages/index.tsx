import { useState, useEffect, useContext } from 'react';
import styles from "../styles/pages/Home.module.scss";
import SongBar from "../components/SongBar";
import LeftBar from "../components/LeftBar";
import SongCard from "../components/SongCard";
import { SpotifyContext } from "../contexts/spotify";
import { PlaylistObject } from '../services/spotifyapi';

let arr = [1, 2, 34];
export default function Home() {
  const {
    getCurrentUserPlayLists
  } = useContext(SpotifyContext);

  const [playLists, setPlayLists] = useState(Array<PlaylistObject>());

  useEffect(()=> {
    async function fetchAPI(){
      setPlayLists(await getCurrentUserPlayLists());
    }
    fetchAPI();
  }, []); 

  return (
    <>
      <SongBar />
      <LeftBar />
      <main className={styles.homeContainer}>
        <div className={styles.homeWrapper}>
          <section className={styles.homeSection}>
            <h1>Playlists</h1>
            <ul>
              {
                playLists.map(playList =>
                  <SongCard
                    title={ playList.name }
                    subtitle={ playList.owner.display_name }
                    coverURL={ playList.images[0].url }
                  />)
              }
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
