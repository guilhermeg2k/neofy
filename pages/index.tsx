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
    playLists,
    followedArtists,
    getUserRecentlyPlayedTracks
  } = useContext(UserContext);

  useEffect(() => {
    async function fetchAPI() {
      console.log("CALL ME BITCH");
      setRecentylePlayedTracks(await getUserRecentlyPlayedTracks(15));

    }
    fetchAPI();
  }, []);

  useEffect(() => {
    async function fetchAPI() {
      console.log(recentlyPlayedTracks);
      if (recentlyPlayedTracks.length > 0 && recentlyPlayedTracks[0].context) {
        const playListID = recentlyPlayedTracks[0].context.uri.split(":")[2];
        setSelectedItem(
          {
            track: recentlyPlayedTracks[0].track,
            context: recentlyPlayedTracks[0].context,
            playList: await spotifyAPI.getPlayList(playListID)
          }
        )
      }
    }

    fetchAPI();
  }, [recentlyPlayedTracks]);
  console.log(selectedItem);
  return (
    <>
      <SongBar />
      <LeftBar />

      <main className={styles.homeContainer}>
        <div className={styles.homeWrapper}>
          <section className={styles.homeMainContainer}>
            { selectedItem.track ?
              <HomeMainCard
                name={selectedItem.track.name}
                subtitle={
                  selectedItem.playList.type == "playlist" ? `On playlist ${selectedItem.playList.name}` : "no"
                }
                backgroundURL={selectedItem.track.album.images[0].url}
                uri={selectedItem.track.uri}
                contextUri={selectedItem.context.uri}
              />
              : <></>
            }
            <div className={styles.suggestionsContainer}>
              {
                recentlyPlayedTracks.slice(2,7).map(item => <SuggestionCard 
                  name = {item.track.name}
                  subtitle = {item.track.artists[0].name}
                  imageURL={item.track.album.images[0].url}
                  />)
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
