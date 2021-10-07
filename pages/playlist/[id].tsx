import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType, GetStaticPaths } from 'next';
import styles from "../../styles/pages/Playlist.module.scss";
import LeftBar from "../../components/LeftBar";
import SongBar from "../../components/SongBar";
import { useEffect, useState } from 'react';
import { PlaylistObject, spotifyAPI } from '../../services/spotifyapi';
import PageSpinner from '../../components/PageSpinner';
import { htmlDecode } from '../../utils';
import { ThumbUpSharp, LibraryMusic, Schedule } from '@material-ui/icons';

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
  const [playlist, setPlaylist] = useState<PlaylistObject>();
  useEffect(() => {
    async function fecthAPI() {
      try {
        const playlist = await spotifyAPI.getPlaylist(id);
        setPlaylist(playlist);
        console.log(playlist, "aa");
      } catch (err) {
        console.log(err);
      }
    }
    fecthAPI();
  }, []);
  return (
    <div>
      <SongBar />
      <LeftBar />
      <main className={styles.playlistContainer}>
        <div className={styles.playlistWrapper}>
          {playlist === undefined ? <PageSpinner/> :
            <>
              <div>
                <div>
                  <img src={playlist.images[0].url}></img>
                </div>
                <h1>{playlist.name}</h1>
                <span>{htmlDecode(playlist.description)}</span>
                <span>by {playlist.owner.display_name}</span>
                <div className={styles.stats}>
                  <span><ThumbUpSharp/>{playlist.followers.total}</span>
                  <span><LibraryMusic/>{playlist.tracks.items.length}</span>
                  <span><Schedule/>3h</span>
                </div>
              </div>
              <div>
                RIGHT
              </div>
            </>
          }
        </div>
      </main>
    </div>
  )
}
