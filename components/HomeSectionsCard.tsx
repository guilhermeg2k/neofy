import styles from "../styles/components/HomeSectionsCard.module.scss";
import { ArtistObject, PlayHistoryObject, PlaylistObject, SavedAlbumObject, spotifyAPI, SavedTrackObject } from "../services/spotifyapi";
import { useEffect, useState } from "react";

interface SectionData {
  item: | SavedTrackObject | SavedAlbumObject | PlaylistObject | PlayHistoryObject | ArtistObject;
  type: "playlist" | "album" | "track" | "artist" | "recentlyPlayedTrack";
}

interface HomeSectionCardProps {
  sectionData: SectionData;
}

export default function HomeSectionCard({ sectionData }: HomeSectionCardProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [uri, setUri] = useState("");
  const [contextUri, setContextUri] = useState("");
  const [isToPlayFromBeginning, setIsToPlayFromBeginning] = useState(false);

  console.log(sectionData);

  useEffect(() => {
    switch (sectionData.type) {
      case "album":
        setTitle(sectionData.item.album.name);
        setSubtitle(sectionData.item.album.artists[0].name);
        setImageURL(sectionData.item.album.images[0].url);
        setContextUri(sectionData.item.album.uri);
        setIsToPlayFromBeginning(true);
        break;
      case "track":
        setTitle(sectionData.item.track.name);
        setSubtitle(sectionData.item.track.artists[0].name);
        setImageURL(sectionData.item.track.album.images[0].url);
        setUri(sectionData.item.track.uri);
        break;
      case "playlist":
        setTitle(sectionData.item.name);
        setSubtitle("Playlist");
        setImageURL(sectionData.item.images[0].url);
        setContextUri(sectionData.item.uri);
        setIsToPlayFromBeginning(true);
        break;
      case "artist":
        setTitle(sectionData.item.name);
        setImageURL(sectionData.item.images[0].url);
        setContextUri(sectionData.item.uri);
        setIsToPlayFromBeginning(true);
    }
  }, [sectionData]);

  function handlePlay() {
    if (uri !== "") {
      spotifyAPI.playUri(uri);
    } else {
      if (sectionData.type == "artist") {
        spotifyAPI.playContext(contextUri);
      } else {
        spotifyAPI.playContext(contextUri, 0);
      }
    }
  }

  return (
    <li className={styles.cardContainer} onClick={handlePlay}>
      <div>
        <h3 title={title}>{title}</h3>
        {subtitle ? <h4>{subtitle}</h4> : <></>}
      </div>
      <div>
        <img src={imageURL} alt="cover" />
      </div>
    </li>
  )
}