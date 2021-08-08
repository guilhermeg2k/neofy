import styles from "../styles/components/SuggestionCard.module.scss";
import { useState, useEffect } from "react";
import { PlayCircleFilled } from "@material-ui/icons";
import { Suggestion } from "../contexts/user";

interface SuggestionCardProps {
  suggestion: Suggestion;
}

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    switch(suggestion.type){
      case "album":
        setTitle(suggestion.item.album.name);
        setSubtitle(suggestion.item.album.artists[0].name);
        setImageURL(suggestion.item.album.images[0].url);
        break;
      case "track":
        setTitle(suggestion.item.track.name);
        setSubtitle(suggestion.item.track.artists[0].name);
        setImageURL(suggestion.item.track.album.images[0].url);
        break;
      case "playlist":
        setTitle(suggestion.item.name);
        setSubtitle("Playlist");
        setImageURL(suggestion.item.images[0].url);
        break;
    }
  }, []);

  return (
    <div className={styles.suggestionCardContainer}>
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