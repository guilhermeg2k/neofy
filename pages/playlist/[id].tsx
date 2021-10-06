import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType, GetStaticPaths } from 'next';
import styles from "../../styles/pages/Playlist.module.scss";
import LeftBar from "../../components/LeftBar";
import SongBar from "../../components/SongBar";

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  return {
    props: {
      id: context.params.id
    },
  }
}

export default function Playlist({ id }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <SongBar />
      <LeftBar />
      <main className={styles.playlistContainer}>
        <div className={styles.playlistWrapper}>
          hello
        </div>
      </main>
    </div>
  )
}
