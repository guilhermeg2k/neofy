import styles from "../styles/components/SuggestionCard.module.scss";
import { useState, useEffect, useContext } from "react";
import { PlayCircleFilled } from "@material-ui/icons";
import { Suggestion } from "../contexts/user";
import { SongBarContext } from "../contexts/songBar";
import { SpotifyAPI } from "../services/spotifyapi";

interface SuggestionCardProps {
  suggestion: Suggestion;
}

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [uri, setUri] = useState("");
  const [contextUri, setContextUri] = useState("");
  const [isToPlayFromBeginning, setIsToPlayFromBeginning] = useState(false);
  
  const spotifyAPI = new SpotifyAPI();

  useEffect(() => {
    switch(suggestion.type){
      case "album":
        setTitle(suggestion.item.album.name);
        setSubtitle(suggestion.item.album.artists[0].name);
        setImageURL(suggestion.item.album.images[0].url);
        setContextUri(suggestion.item.album.uri);
        setIsToPlayFromBeginning(true);
        break;
      case "track":
        setTitle(suggestion.item.track.name);
        setSubtitle(suggestion.item.track.artists[0].name);
        setImageURL(suggestion.item.track.album.images[0].url);
        setUri(suggestion.item.track.uri);
        break;
      case "playlist":
        setTitle(suggestion.item.name);
        setSubtitle("Playlist");
        setImageURL(suggestion.item.images[0].url);
        setContextUri(suggestion.item.uri);
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