import { createContext, useState, useEffect, ReactNode } from "react";
import { AlbumObject, ArtistObject, PlayHistoryObject, PlaylistObject, SpotifyAPI, TimeRange, TrackObject } from "../services/spotifyapi";

interface UserProviderProps {
  children: ReactNode;
}

export interface Suggestion {
  item: TrackObject | AlbumObject | PlaylistObject | PlayHistoryObject;
  type: "playlist" | "album" | "track" | "recentlyPlayedTrack";
}

interface UserContextData {
  playlists: Array<PlaylistObject>;
  followedArtists: Array<ArtistObject>;
  savedTracks: Array<TrackObject>;
  savedAlbums: Array<AlbumObject>;
  top20Tracks: Array<TrackObject>;
  suggestions: Array<Suggestion>;
  getUserTopArtists: (timeRange?: TimeRange, limit?: number, offset?: number) => Promise<Array<ArtistObject>>;
  getUserTopTracks: (timeRange?: TimeRange, limit?: number, offset?: number) => Promise<Array<TrackObject>>;
  getUserRecentlyPlayedTracks: (limit?: number) => Promise<Array<PlayHistoryObject>>;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const spotifyAPI = new SpotifyAPI();

  const [playlists, setPlayLists] = useState(Array<PlaylistObject>());
  const [followedArtists, setFollowedArtists] = useState(Array<ArtistObject>());
  const [savedTracks, setSavedTracks] = useState(Array<TrackObject>());
  const [savedAlbums, setSavedAlmbums] = useState(Array<AlbumObject>());
  const [top20Tracks, setTop20Tracks] = useState(Array<TrackObject>());
  const [suggestions, setSuggestions] = useState(Array<Suggestion>());

  useEffect(() => {
    async function fetchAPI() {
      setPlayLists(await spotifyAPI.getCurrentUserPlayLists(20));
      setFollowedArtists(await spotifyAPI.getUserFollowedArtists());
      setSavedAlmbums(await spotifyAPI.getUserSavedAlbums(20));
      setSavedTracks(await spotifyAPI.getUserSavedTracks(20));
      setTop20Tracks(await spotifyAPI.getUserTopTracks(TimeRange.short_term, 20));

    }
    fetchAPI();
  }, []);

  useEffect(() => {
    setSuggestions(generateSuggestions());
  }, [savedTracks, savedAlbums, playlists]);

  async function getUserTopArtists(timeRange = TimeRange.short_term, limit = 10, offset = 0) {
    return await spotifyAPI.getUserTopArtists(timeRange, limit, offset);
  }

  async function getUserTopTracks(timeRange = TimeRange.short_term, limit = 10, offset = 0) {
    return await spotifyAPI.getUserTopTracks(timeRange, limit, offset);
  }

  async function getUserRecentlyPlayedTracks(limit = 10) {
    return await spotifyAPI.getUserRecentlyPlayedTracks(limit);
  }

  function generateSuggestions(max = 6): Array<Suggestion> {
    if (playlists.length > 0 && savedAlbums.length > 0 && savedTracks.length > 0) {
      const suggestions = Array<Suggestion>();
      for (let i = 0; i < max; i++) {
        const option = Math.floor(Math.random() * 3);
        const selection = Math.floor(Math.random() * 20);
        switch (option) {
          case 0:
            suggestions.push({
              item: playlists[selection % playlists.length],
              type: "playlist"
            });
            break;
          case 1:
            suggestions.push({
              item: savedAlbums[selection % savedAlbums.length],
              type: "album"
            });
            break;
          case 2:
            suggestions.push({
              item: savedTracks[selection % savedTracks.length],
              type: "track"
            });
            break;
          case 3:
            console.log("333333333");
        }
      }
      return suggestions;
    }
    return undefined;
  }

  return (
    <UserContext.Provider
      value={{
        playlists,
        savedAlbums,
        followedArtists,
        savedTracks,
        getUserTopArtists,
        getUserTopTracks,
        getUserRecentlyPlayedTracks,
        top20Tracks,
        suggestions
      }}
    >
      {children}
    </UserContext.Provider>
  )
}