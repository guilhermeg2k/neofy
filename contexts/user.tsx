import { createContext, useState, useEffect, ReactNode } from "react";
import { AlbumObject, ArtistObject, DataObject, PlayHistoryObject, PlaylistObject, SavedAlbumObject, SavedTrackObject, spotifyAPI, TimeRange, TrackObject } from "../services/spotifyapi";

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextData {
  playlists: Array<PlaylistObject>;
  followedArtists: Array<ArtistObject>;
  savedTracks: Array<SavedTrackObject>;
  savedAlbums: Array<SavedAlbumObject>;
  top20Tracks: Array<TrackObject>;
  suggestions: Array<DataObject>;
  getUserTopArtists: (timeRange?: TimeRange, limit?: number, offset?: number) => Promise<Array<ArtistObject>>;
  getUserTopTracks: (timeRange?: TimeRange, limit?: number, offset?: number) => Promise<Array<TrackObject>>;
  getUserRecentlyPlayedTracks: (limit?: number) => Promise<Array<PlayHistoryObject>>;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const [playlists, setPlayLists] = useState(Array<PlaylistObject>());
  const [followedArtists, setFollowedArtists] = useState(Array<ArtistObject>());
  const [savedTracks, setSavedTracks] = useState(Array<SavedTrackObject>());
  const [savedAlbums, setSavedAlmbums] = useState(Array<SavedAlbumObject>());
  const [top20Tracks, setTop20Tracks] = useState(Array<TrackObject>());
  const [suggestions, setSuggestions] = useState(Array<DataObject>());

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
  }, [playlists, savedAlbums, savedTracks]);

  async function getUserTopArtists(timeRange = TimeRange.short_term, limit = 10, offset = 0) {
    return await spotifyAPI.getUserTopArtists(timeRange, limit, offset);
  }

  async function getUserTopTracks(timeRange = TimeRange.short_term, limit = 10, offset = 0) {
    return await spotifyAPI.getUserTopTracks(timeRange, limit, offset);
  }

  async function getUserRecentlyPlayedTracks(limit = 10) {
    return await spotifyAPI.getUserRecentlyPlayedTracks(limit);
  }

  function generateOption(optionsHistoric: Array<number>, selectionsHistoric: Array<Array<number>>): number {
    let option = Math.floor(Math.random() * 3)
    let isOptionFullySuggested = false;

    if (optionsHistoric.length > 0) {

      do {
        option = Math.floor(Math.random() * 3);
        switch (option) {
          case 0:
            if (playlists.length === selectionsHistoric[0].length) {
              isOptionFullySuggested = true;
            }
            break;
          case 1:
            if (savedAlbums.length === selectionsHistoric[1].length) {
              isOptionFullySuggested = true;
            }
          case 2:
            if (savedTracks.length === selectionsHistoric[2].length) {
              isOptionFullySuggested = true;
            }
        }

      } while (optionsHistoric[optionsHistoric.length - 1] === option || isOptionFullySuggested);
    }
    return option;
  }

  function generateSelection(option: number, selectionsHistoric: Array<Array<number>>): number {
    let selection: number;
    let isAlreadySelected: Boolean;

    do {
      selection = Math.floor(Math.random() * 20);
      isAlreadySelected = selectionsHistoric[option].some(item => item == selection);
    } while (isAlreadySelected);

    return selection;
  }

  function generateSuggestions(max = 6): Array<DataObject> {
    if (playlists.length > 0 && savedAlbums.length > 0 && savedTracks.length > 0) {
      const suggestions = Array<DataObject>();
      const optionsHistoric = Array<number>();
      const selectionsHistoric = Array<Array<number>>(3);
      selectionsHistoric.fill([]);

      for (let i = 0; i < max; i++) {
        const option = generateOption(optionsHistoric, selectionsHistoric);
        const selection = generateSelection(option, selectionsHistoric);
        optionsHistoric.push(option);

        switch (option) {
          case 0:
            selectionsHistoric[0].push(selection);
            suggestions.push({
              item: playlists[selection % playlists.length],
              type: "playlist"
            });
            break;
          case 1:
            selectionsHistoric[1].push(selection);
            suggestions.push({
              item: savedAlbums[selection % savedAlbums.length],
              type: "album"
            });
            break;
          case 2:
            selectionsHistoric[2].push(selection);
            suggestions.push({
              item: savedTracks[selection % savedTracks.length],
              type: "track"
            });
            break;
          case 3:
            break;
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