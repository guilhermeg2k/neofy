import { createContext, useState, useEffect, ReactNode } from "react";
import { AlbumObject, ArtistObject, PlayHistoryObject, PlaylistObject, SpotifyAPI, TimeRange, TrackObject } from "../services/spotifyapi";

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextData {
  playLists: Array<PlaylistObject>;
  followedArtists: Array<ArtistObject>;
  savedTracks: Array<TrackObject>;
  savedAlbums: Array<AlbumObject>;
  getUserTopArtists: (timeRange?: TimeRange, limit?: number, offset?: number) => Promise<Array<ArtistObject>>;
  getUserTopTracks: (timeRange?: TimeRange, limit?: number, offset?: number) => Promise<Array<TrackObject>>;
  getUserRecentlyPlayedTracks: (limit?: number) => Promise<Array<PlayHistoryObject>>;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const spotifyAPI = new SpotifyAPI();

  const [playLists, setPlayLists] = useState(Array<PlaylistObject>());
  const [followedArtists, setFollowedArtists] = useState(Array<ArtistObject>());
  const [savedTracks, setSavedTracks] = useState(Array<TrackObject>());
  const [savedAlbums, setSavedAlmbums] = useState(Array<AlbumObject>());

  useEffect(() => {
    async function fetchAPI() {
      setPlayLists(await spotifyAPI.getCurrentUserPlayLists());
      setFollowedArtists(await spotifyAPI.getUserFollowedArtists());
      setSavedAlmbums(await spotifyAPI.getUserSavedAlbums());
      setSavedTracks(await spotifyAPI.getUserSavedTracks());
    }
    fetchAPI();
  }, []);

  async function getUserTopArtists(timeRange = TimeRange.short_term, limit = 10, offset = 0) {
    return await spotifyAPI.getUserTopArtists(timeRange, limit, offset);
  }

  async function getUserTopTracks(timeRange = TimeRange.short_term, limit = 10, offset = 0) {
    return await spotifyAPI.getUserTopTracks(timeRange, limit, offset);
  }

  async function getUserRecentlyPlayedTracks(limit = 10){
    return await spotifyAPI.getUserRecentlyPlayedTracks(limit);
  }


  return (
    <UserContext.Provider
      value={{
        playLists,
        savedAlbums,
        followedArtists,
        savedTracks,
        getUserTopArtists,
        getUserTopTracks,
        getUserRecentlyPlayedTracks
      }}
    >
      {children}
    </UserContext.Provider>
  )
}