import styles from "../styles/components/SuggestionCard.module.scss";
import { useState, useEffect, useContext } from "react";
import { PlayCircleFilled } from "@material-ui/icons";
import { SongBarContext } from "../contexts/songBar";
import { DataObject, PlaylistObject, SavedAlbumObject, SavedTrackObject, spotifyAPI } from "../services/spotifyapi";

interface SuggestionCardProps {
  suggestion: DataObject;
}

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [uri, setUri] = useState("");
  const [contextUri, setContextUri] = useState("");
  const [isToPlayFromBeginning, setIsToPlayFromBeginning] = useState(false);

  useEffect(() => {
    switch(suggestion.type){
      case "album":
        const savedAlbum = suggestion.item as SavedAlbumObject;
        setTitle(savedAlbum.album.name);
        setSubtitle(savedAlbum.album.artists[0].name);
        setImageURL(savedAlbum.album.images[0].url);
        setContextUri(savedAlbum.album.uri);
        setIsToPlayFromBeginning(true);
        break;
      case "track":
        const savedTrack = suggestion.item as SavedTrackObject;
        setTitle(savedTrack.track.name);
        setSubtitle(savedTrack.track.artists[0].name);
        setImageURL(savedTrack.track.album.images[0].url);
        setUri(savedTrack.track.uri);
        break;
      case "playlist":
        const playlist = suggestion.item as PlaylistObject;
        setTitle(playlist.name);
        setSubtitle(playlist.owner.display_name);
        setImageURL(playlist.images[0].url);
        setContextUri(playlist.uri);
        setIsToPlayFromBeginning(true);
        break;
    }
  }, []);

  function handlePlay() {
    if (uri !== ""){
      spotifyAPI.playUri(uri);
    } else {
      spotifyAPI.playContext(contextUri, 0);
    }
  }

  return (
    <div className={styles.suggestionCardContainer} onClick={handlePlay}>
      <div>
        <img src={imageURL} alt="card-cover" />
      </div>
      <div>
        <div>
          <h1>{title}</h1>
          {subtitle ? <h3>{subtitle}</h3> : <></>}
        </div>
        <PlayCircleFilled/>
      </div>
    </div>
  )
}