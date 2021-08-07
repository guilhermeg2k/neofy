import styles from "../styles/components/HomeMainCard.module.scss";

interface HomeMainCardProps {
  title: string;
  subtitle?: string;
  coverURL: string;
}

export default function HomeSectionCard({ title, subtitle, coverURL }: HomeMainCardProps) {
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