import styles from "../styles/components/HomeMainCard.module.scss";
import {useContext} from "react";

import { PlayHistoryObject } from "../services/spotifyapi";
import { PlayCircleFilled } from "@material-ui/icons";
import { SongBarContext } from '../contexts/songBar';

interface HomeMainCardProps {
  name: string;
  subtitle: string;
  backgroundURL: string;
  contextUri: string;
  uri: string;
}

export default function HomeSectionCard({ name, subtitle, uri, backgroundURL, contextUri }: HomeMainCardProps) {
  const {
    playURI
  } = useContext(SongBarContext);

  function handlePlay(){
    playURI(uri, contextUri);
  }

  return (
    <div className={styles.HomeMainCardContainer}>
      <div className={styles.cardBackGround}>
        <img src={backgroundURL} alt="card background"/>
      </div>
      <div className={styles.cardInfos}>
        <div>
          <h1>{name}</h1>
          <h3>{subtitle}</h3>
        </div>
        <div className="button" onClick={handlePlay}>
          <span>PLAY</span>
          <PlayCircleFilled/>
        </div>
      </div>
    </div>
  )
}