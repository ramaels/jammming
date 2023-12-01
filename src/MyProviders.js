import CurrentUserContext from "./UserContext";
import ThemeContext from "./ThemeContext";

function MyProviders({ children,theme, setTheme, token, search,genres, getGenres,searchResult,playlists,userProfile, currentPlaylist, addItems, removeItems, playlistName, setPlaylistName, playlistDescription, setPlaylistDescription, getAlbumTracks, getPlaylistTracks, getTopTracks, getResults, getSubResults, addPlaylistId, savePlaylist }) {
    return (
        <ThemeContext.Provider value={{theme, setTheme}} >
            <CurrentUserContext.Provider
                value={{
                    token,
                    playlists,
                    userProfile,
                    genres,
                    currentPlaylist,
                    playlistName,
                    playlistDescription,
                    search: search,
                    getGenres: getGenres,
                    searchResult: searchResult,
                    addItems: addItems,
                    removeItems: removeItems,
                    setPlaylistName: setPlaylistName,
                    setPlaylistDescription: setPlaylistDescription,
                    getAlbumTracks: getAlbumTracks,
                    getPlaylistTracks: getPlaylistTracks,
                    getTopTracks: getTopTracks,
                    getResults: getResults,
                    getSubResults: getSubResults,
                    addPlaylistId: addPlaylistId,
                    savePlaylist: savePlaylist
                }}
            >
                {children}
            </CurrentUserContext.Provider>
        </ThemeContext.Provider>
    );
}

export default MyProviders;
