import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/user';
import styles from "../styles/pages/Home.module.scss";
import SongBar from "../components/SongBar";
import LeftBar from "../components/LeftBar";
import Footer from "../components/Footer";
import HomeSectionCard from "../components/HomeSectionsCard";
import HomeMainCard from "../components/HomeMainCard";
import SuggestionCard from '../components/SuggestionCard';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { ArtistObject, PlaylistObject } from '../services/spotifyapi';
import { motion } from "framer-motion";
import PageSpinner from '../components/PageSpinner';

export default function Home() {
  const {
    playlists,
    followedArtists,
    suggestions,
  } = useContext(UserContext);

  const [currentPlaylists, setCurrentPlaylist] = useState(Array<PlaylistObject>());
  const [currentArtists, setCurrentArtists] = useState(Array<ArtistObject>());
  const [currentSectionPage, setCurrentSectionPage] = useState([0, 0]);
  const [numberOfCardsPerSection, setNumberOfCardsPerSection] = useState(5);
  const [isPageContentLoaded, setIsPageContentLoaded] = useState(false);

  function handleNextOnSection<Type>(array: Array<Type>, setFunction: (array: Array<Type>) => void, sectionNumber: number) {
    const newCurrentSectionPage = [...currentSectionPage];
    newCurrentSectionPage[sectionNumber]++;
    const newList = array.slice(numberOfCardsPerSection * newCurrentSectionPage[sectionNumber], numberOfCardsPerSection * newCurrentSectionPage[sectionNumber] + numberOfCardsPerSection);

    if (newList.length > 0) {
      if (newList.length < numberOfCardsPerSection) {
        for (let i = 0; i <= numberOfCardsPerSection - newList.length; i++) {
          newList.push(array[i]);
        }
      }
      setCurrentSectionPage(newCurrentSectionPage);
      setFunction(newList);
    }
  }

  function handleBackOnSection<Type>(array: Array<Type>, setFunction: (array: Array<Type>) => void, sectionNumber: number) {
    const newCurrentSectionPage = [...currentSectionPage];
    newCurrentSectionPage[sectionNumber]--;
    const newList = array.slice(numberOfCardsPerSection * newCurrentSectionPage[sectionNumber], numberOfCardsPerSection * newCurrentSectionPage[sectionNumber] + numberOfCardsPerSection);

    if (newList.length > 0) {
      setCurrentSectionPage(newCurrentSectionPage);
      setFunction(newList);
    }
  }

  useEffect(() => {
    setCurrentPlaylist(playlists.slice(0, numberOfCardsPerSection));
    setCurrentArtists(followedArtists.slice(0, numberOfCardsPerSection));
    

  }, [playlists, followedArtists]);

  useEffect(() => {
    if (suggestions != undefined) {
      if (playlists.length !== 0 && followedArtists.length !== 0 && suggestions.length !== 0) {
        setIsPageContentLoaded(true);
      }
    }
  }, [playlists, followedArtists, suggestions]);

  return (
    <div>
      <SongBar />
      <LeftBar />
      {
        isPageContentLoaded ?
          <>
            <motion.main
              initial={{ x: "1000" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className={styles.homeContainer}
            >
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
                  <div className={styles.sectionHeader}>
                    <h1>Your Playlists</h1>
                    <div>
                      <ChevronLeft onClick={() => handleBackOnSection(playlists, setCurrentPlaylist, 0)} />
                      <ChevronRight onClick={() => handleNextOnSection(playlists, setCurrentPlaylist, 0)} />
                    </div>
                  </div>
                  <ul>
                    {
                      currentPlaylists.map(playlist =>
                        <HomeSectionCard
                          sectionData={{
                            item: playlist,
                            type: "playlist"
                          }}
                        />)
                    }
                  </ul>
                </section>
                <section className={styles.homeSection}>
                  <div className={styles.sectionHeader}>
                    <h1>Followed Artists</h1>
                    <div>
                      <ChevronLeft onClick={() => handleBackOnSection(followedArtists, setCurrentArtists, 1)} />
                      <ChevronRight onClick={() => handleNextOnSection(followedArtists, setCurrentArtists, 1)} />
                    </div>
                  </div>
                  <ul>
                    {
                      currentArtists.map(artist =>
                        <HomeSectionCard
                          sectionData={{
                            item: artist,
                            type: "artist"
                          }}
                        />)
                    }
                  </ul>
                </section>
              </div>
            </motion.main>
            <Footer />
          </>
          : <PageSpinner/>
          
      }

    </div>
  );
}
