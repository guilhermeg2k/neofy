import { useState } from 'react';
import styles from "../styles/pages/Home.module.scss";
import SongBar from "../components/SongBar";
import LeftBar from "../components/LeftBar";
import SongCard from "../components/SongCard";


let arr = [1, 2, 34];
export default function Home() {
  return (
    <>
      <SongBar />
      <LeftBar />
      <main className={styles.homeContainer}>
        <div className={styles.homeWrapper}>
          <section className={styles.homeSection}>
            <h1>Recently played</h1>
            <ul>
              {
                [1, 2, 3].map(key =>
                  <SongCard
                    title={`Don't smile at me`}
                    subtitle="by billie eilish"
                    coverURL="https://i.scdn.co/image/ab67616d0000b273a9f6c04ba168640b48aa5795"
                  />)
              }
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
