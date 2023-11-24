import CurrentUserContext from "./UserContext";

function MyProviders({ children, token, search,genres, getGenres,searchResult,playlists,userProfile, currentPlaylist, addItems, removeItems, playlistName, setPlaylistName, playlistDescription, setPlaylistDescription, getAlbumTracks, getPlaylistTracks, getTopTracks, getResults, getSubResults, addPlaylistId, savePlaylist }) {
    return (
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
    );
}

export default MyProviders;
