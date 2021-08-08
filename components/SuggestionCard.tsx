import styles from "../styles/components/SuggestionCard.module.scss";
import { PlayCircleFilled } from "@material-ui/icons";

interface SuggestionCardProps {
  name: string;
  subtitle?: string;
  imageURL: string;
}

export default function SuggestionCard({ name, subtitle, imageURL }: SuggestionCardProps) {
  return (
    <div className={styles.suggestionCardContainer}>
      <div>
        <img src={imageURL} alt="card-cover" />
      </div>
      <div>
        <div>
          <h1>{name}</h1>
          {subtitle ? <h3>{subtitle}</h3> : <></>}
        </div>
        <PlayCircleFilled/>
      </div>
    </div>
  )
}