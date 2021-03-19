import SongBar from "../components/SongBar";
import { useEffect } from "react";
import { getUserInfo } from "../services/spotifyapi";

export default function Home() {
  return (
    <>
      <SongBar />
    </>
  );
}
