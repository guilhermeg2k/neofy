import { useState, useContext, useEffect } from "react";
import styles from "../styles/components/HomeCarousel.module.scss";
import { PlayCircleFilled } from "@material-ui/icons";
import { AlbumObject, ArtistObject, PlaylistObject, TimeRange, TrackObject } from "../services/spotifyapi";
import { SongBarContext } from "../contexts/songBar";

interface HomeCarouselProps {
  topArtists?: Array<ArtistObject>;
  topTracks?: Array<string>;
  albums?: Array<AlbumObject>;
}

export default function HomeCarousel() {
  return (
    <div className={styles.carouselContainer}>

    </div>
  )
}