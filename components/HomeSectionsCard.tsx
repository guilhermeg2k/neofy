import styles from "../styles/components/HomeSectionsCard.module.scss";
import { ArtistObject, PlayHistoryObject, PlaylistObject, SavedAlbumObject, spotifyAPI, SavedTrackObject, TrackObject, DataObject } from "../services/spotifyapi";
import { useEffect, useState } from "react";

interface HomeSectionCardProps {
  sectionData: DataObject;
}

export default function HomeSectionCard({ sectionData }: HomeSectionCardProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [uri, setUri] = useState("");
  const [contextUri, setContextUri] = useState("");
  const [isToPlayFromBeginning, setIsToPlayFromBeginning] = useState(false);

  useEffect(() => {
    switch (sectionData.type) {
      case "album":
        const savedAlbum = sectionData.item as SavedAlbumObject;
        setTitle(savedAlbum.album.name);
        setSubtitle(savedAlbum.album.artists[0].name);
        setImageURL(savedAlbum.album.images[0].url);
        setContextUri(savedAlbum.album.uri);
        setIsToPlayFromBeginning(true);
        break;
      case "track":
        const savedTrack = sectionData.item as SavedTrackObject;
        setTitle(savedTrack.track.name);
        setSubtitle(savedTrack.track.artists[0].name);
        setImageURL(savedTrack.track.album.images[0].url);
        setUri(savedTrack.track.uri);
        break;
      case "playlist":
        const playlist = sectionData.item as PlaylistObject;
        setTitle(playlist.name);
        setSubtitle(playlist.owner.display_name);
        setImageURL(playlist.images[0].url);
        setContextUri(playlist.uri);
        setIsToPlayFromBeginning(true);
        break;
      case "artist":
        const artist = sectionData.item as ArtistObject;
        setTitle(artist.name);
        setImageURL(artist.images[0].url);
        setContextUri(artist.uri);
        setSubtitle("Artist");
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