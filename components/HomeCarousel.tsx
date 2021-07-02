import { useState, useContext, useEffect } from "react";
import styles from "../styles/components/HomeCarousel.module.scss";
import { PlayCircleFilled } from "@material-ui/icons";
import { AlbumObject, ArtistObject, PlaylistObject, TimeRange, TrackObject } from "../services/spotifyapi";
import { SpotifyContext } from "../contexts/spotify";
interface HomeCarouselProps {
  topArtists?: Array<ArtistObject>;
  topTracks?: Array<string>;
  albums?: Array<AlbumObject>;
}

export default function HomeCarousel() {
  const {
    getUserSavedAlbums,
    getCurrentUserPlayLists,
    getUserTopArtists,
    getUserTopTracks,
  } = useContext(SpotifyContext);

  const [albums, setAlbums] = useState({list: Array<AlbumObject>()});
  const [topArtists, setTopArtists] = useState({list: Array<ArtistObject>()});
  const [topTracks, setTopTracks] = useState({list: Array<TrackObject>()});
  const [playLists, setPlayLists] = useState({list: Array<PlaylistObject>()});
  const [selectedItems, setSelectedItes] = useState({list: Array<PlaylistObject | TrackObject | ArtistObject | AlbumObject>()});

  useEffect(() => {
    async function fetchAPI() {
      if (albums.list.length == 0) {
        setAlbums({list :await getUserSavedAlbums(50)});
      }
      if (playLists.list.length == 0) {
        setPlayLists({list: await getCurrentUserPlayLists(50)});
      }
      if (topArtists.list.length == 0) {
        setTopArtists({list: await getUserTopArtists(TimeRange.short_term, 50)});
      }
      if (topTracks.list.length == 0) {
        setTopTracks({list: await getUserTopTracks(TimeRange.short_term, 50)});
      }
      selectItems();
    };
    fetchAPI();
  }, []);

  function selectItems() {
    const randomNumber = Math.floor(Math.random() * 50);
    const _selectedItems = Array<PlaylistObject | TrackObject | ArtistObject | AlbumObject>();
    _selectedItems.push(albums[randomNumber % albums.list.length]);
    _selectedItems.push(playLists[randomNumber % playLists.list.length]);
    _selectedItems.push(topArtists[randomNumber % topArtists.list.length]);
    _selectedItems.push(topTracks[randomNumber % topTracks.list.length]);
    setSelectedItes({list: _selectedItems});
    console.log(selectedItems);
  }

  return (
    <div className={styles.carouselContainer}>
      {
        selectedItems.list.map(item => {
          <main style={{ backgroundImage: `url('')` }}>
            <div>
              <div>
                <h3>{item?.name}</h3>
                <h4>by {item?.name}</h4>
              </div>
              <div className={styles.playButton}>
                <span>PLAY</span>
                <PlayCircleFilled />
              </div>
            </div>
          </main>
        })
      }
    </div>
  )
}