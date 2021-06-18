import styles from "../styles/components/LeftBar.module.scss";
import {
    Home,
    Search,
    LibraryMusic,
    Audiotrack,
    QueueMusic,
    Album
} from "@material-ui/icons";
export default function LeftBar(){
    return (
        <nav className={styles.leftBarContainer}>
            <div className={styles.leftBarWrapper}>
                <div className={styles.iconButton}>
                    <Home />
                </div>
                <div className={styles.iconButton}>
                    <Search />
                </div>
                <div className={styles.iconButton}>
                    <LibraryMusic />
                </div>
                <div className={styles.iconButton}>
                    <Audiotrack />
                </div>
                <div className={styles.iconButton}>
                    <QueueMusic />
                </div>
                <div className={styles.iconButton}>
                    <Album />
                </div>
            </div>
        </nav>
    )
}