import styles from "../styles/components/PageSpinner.module.scss";

export default function PageSpinner() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
      </div>
    </div>
  )
}