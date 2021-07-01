import styles from "../styles/components/HomeCard.module.scss";

interface SongCardProps {
  title: string;
  subtitle?: string;
  coverURL: string;
}

export default function HomeCard({ title, subtitle, coverURL }: SongCardProps) {
  return (
    <li className={styles.cardContainer}>
      <div>
        <h3>{title}</h3>
        { subtitle ? <h4>{subtitle}</h4> : <></> }
      </div>
      <div>
        <img src={coverURL} alt="cover" />
      </div>
    </li>
  )
}