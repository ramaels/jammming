import style from "./styles/app.module.css";

import Spotify from "./utils/Spotify";
import { useState, useCallback, useEffect } from 'react';

import MyProviders from "./MyProviders";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlists from "./components/Playlists";
import CurrentSelection from "./components/CurrentSelection";
import themeStyle from "./styles/theme.module.css";

const auth = new Spotify(64, '04c4415a520843cd92e8673a3ff41593', 'https://prismatic-starship-410df8.netlify.app/');

function App() {
  const [theme, setTheme] = useState('light');
  const [token, setToken] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [genres, setGenres] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState({
    id: null,
    tracks: []
  });
  const [playlistName, setPlaylistName] = useState('New Playlist Name');
  const [playlistDescription, setPlaylistDescription] = useState('Enter a description...');

  const fetchFromSpotify = useCallback(async (url, method = 'GET', body = null) => {
    const payload = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access_token}`
      },
      body: body ? JSON.stringify(body) : null
    };

    const { data, token: updatedToken } = await auth.fetchWithRetry(url, token, payload);
    if (updatedToken && updatedToken.access_token !== token.access_token) {
      setToken(updatedToken);
    }
    return data;
  }, [token]);

  const getToken = useCallback((code) => {
    return auth.getToken(code);
  }, []);

  const search = useCallback((query, type) => {
    const url = `https://api.spotify.com/v1/search?q=${query}${type !== '' ? '&type=' + type : ''}`;
    return fetchFromSpotify(url).then(setSearchResult);
  }, [fetchFromSpotify]);

  const getResults = useCallback((url) => {
    return fetchFromSpotify(url).then(setSearchResult);
  }, [fetchFromSpotify]);

  const getSubResults = useCallback((url) => {
    return fetchFromSpotify(url);
  }, [fetchFromSpotify]);

  const getUserProfile = useCallback(() => {
    const url = 'https://api.spotify.com/v1/me';
    return fetchFromSpotify(url).then(setUserProfile).then(() => { localStorage.removeItem('profile_state'); });
  }, [fetchFromSpotify]);

  const getGenres = useCallback(() => {
    const url = "https://api.spotify.com/v1/recommendations/available-genre-seeds";
    return fetchFromSpotify(url).then(data => data.genres);
  }, [fetchFromSpotify]);

  const getPlaylists = useCallback((user_id) => {
    const url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    return fetchFromSpotify(url).then(setPlaylists);
  }, [fetchFromSpotify]);

  const getAlbumTracks = useCallback((item) => {
    const url = item.href;
    return fetchFromSpotify(url);
  }, [fetchFromSpotify]);

  const getPlaylistTracks = useCallback((playlist) => {
    const url = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=20`
    return fetchFromSpotify(url);
  }, [fetchFromSpotify]);

  const getTopTracks = useCallback(async (artist, userProfile) => {
    const url = `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=${userProfile.country}`;
    return fetchFromSpotify(url);
  }, [fetchFromSpotify]);

  const savePlaylist = useCallback(async () => {
    const exists = playlists.items.some(playlist => playlist.id === currentPlaylist.id);
    console.log(exists);
    if (exists) {
      const newTracks = currentPlaylist.tracks.filter(currentItem => !currentPlaylist.source.some(sourceItem => sourceItem.id === currentItem.id));
      const tracksToRemove = currentPlaylist.source.filter(sourceItem => !currentPlaylist.tracks.some(currentItem => currentItem.id === sourceItem.id));
      console.log('newTracks: ', newTracks);
      console.log('tracksToRemove', tracksToRemove);
      const url = `https://api.spotify.com/v1/playlists/${currentPlaylist.id}/tracks`;

      if (newTracks.length > 0) {
        const urisArr = newTracks.map(item => item.uri);
        const body = {
          uris: urisArr,
          position: 0
        };
        fetchFromSpotify(url,'POST',body).then(()=>{getPlaylists(userProfile.id);});
      }
      if (tracksToRemove.length > 0) {
        const urisArr = tracksToRemove.map(item => ({ uri: item.uri }));
        const body = {
          tracks: urisArr,
          snapshot_id: currentPlaylist.snapshot_id
        };
        fetchFromSpotify(url,'DELETE',body).then(()=>{getPlaylists(userProfile.id);});
      }
    } else {
      const url1 = `https://api.spotify.com/v1/users/${userProfile.id}/playlists`;
      const body1 = {
        name: playlistName,
        description: playlistDescription,
        public: false
      };
      const playlistCreated = await fetchFromSpotify(url1,'POST',body1);

      const urisArr = currentPlaylist.tracks.map(item => item.uri);
      const url2 = await `https://api.spotify.com/v1/playlists/${playlistCreated.id}/tracks`;
      const body2 = {
        uris: urisArr,
        position: 0
      };
      await fetchFromSpotify(url2,'POST',body2);
      await getPlaylists(userProfile.id);
    }
  }, [playlists, currentPlaylist, userProfile, getPlaylists, playlistName, playlistDescription,fetchFromSpotify]);

  const addPlaylistId = useCallback((id, data, snapshot_id) => {
    setCurrentPlaylist(pre => ({
      ...pre,
      id: id,
      snapshot_id: snapshot_id,
      source: data
    }));
  }, []);

  const addItems = useCallback((data, tracks) => {
    if (Array.isArray(data)) {
      const filteredData = data.filter(dataItem => !tracks.some(trackItem => trackItem.id === dataItem.id)
      );
      setCurrentPlaylist(pre => ({
        ...pre,
        tracks: [...filteredData, ...pre.tracks]
      }));
    } else if (typeof data === "object") {
      const exists = tracks.some(track => track.id === data.id);
      if (!exists) {
        setCurrentPlaylist(pre => ({
          ...pre,
          tracks: [data, ...pre.tracks]
        }));
      }
    }
  }, []);

  const removeItems = useCallback((data) => {
    if (Array.isArray(data)) {
      setCurrentPlaylist(prev => {
        const filteredTrack = prev.tracks.filter(track => !data.some(item => item.id === track.id));
        return {
          ...prev,
          tracks: filteredTrack
        };
      });

    } else if (typeof data === "object") {
      setCurrentPlaylist(prev => {
        const newDataArray = prev.tracks.filter(track => track.id !== data.id);
        return {
          ...prev,
          tracks: newDataArray
        };
      });
    }
  }, []);

  const handleLogin = useCallback(() => {
    auth.generateCodeVerifier();
    auth.generateCodeChallenge().then((codeChallenge) => {
      console.log(codeChallenge);
      window.localStorage.setItem('code_verifier', auth.codeVerifier);
      window.localStorage.setItem('code_challenge', codeChallenge);
      localStorage.setItem('connect_state', 'requesting');
      const params = {
        response_type: 'code',
        client_id: auth.clientId,
        scope: auth.scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: auth.redirectUri,
      }

      auth.authUrl.search = new URLSearchParams(params).toString();
      /* the OAuth service redirects the user back to the URL specified in the redirect_uri field */
      window.location.href = auth.authUrl.toString();
    });
  }, []);

  // check if app needs to retrieve access token, user profile, user playlists, or the music genres
  useEffect(() => {
    if (token.access_token && !window.localStorage.getItem('refresh_state')) { // get the curent user profile when the access token is provided
      if (!userProfile && localStorage.getItem('profile_state') !== 'true') {
        localStorage.setItem('profile_state', 'true');
        getUserProfile(token).then(() => { localStorage.removeItem('profile_state'); });
      } else if (userProfile && !playlists) {
        if (!localStorage.getItem('playlists_state')) {
          localStorage.setItem('playlists_state', 'true');
          getPlaylists(userProfile.id).then(() => { localStorage.removeItem('playlists_state') });
        }
      }
      if (genres.length === 0) {
        if (!localStorage.getItem('genres_state') !== 'true') {
          localStorage.setItem('genres_state', 'true');
          getGenres(token).then(setGenres).then(() => {
            localStorage.removeItem('genres_state');
          });
        }
      }
    } else if (!token.access_token && window.localStorage.getItem('connect_state')) {
      auth.codeVerifier = window.localStorage.getItem('code_verifier');
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get('code');
      if (code) {
        if (localStorage.getItem('connect_state') !== 'pending') {
          getToken(code).then(setToken).then(() => { localStorage.removeItem('connect_state') });
        }
      }
    }
  }, [getToken, token, userProfile, getPlaylists, playlists, genres, getGenres, getUserProfile]);

  return (
    <MyProviders
      token={token}
      playlists={playlists}
      userProfile={userProfile}
      search={search}
      genres={genres}
      getGenres={getGenres}
      searchResult={searchResult}
      currentPlaylist={currentPlaylist}
      addItems={addItems}
      removeItems={removeItems}
      playlistName={playlistName}
      playlistDescription={playlistDescription}
      setPlaylistName={setPlaylistName}
      setPlaylistDescription={setPlaylistDescription}
      getAlbumTracks={getAlbumTracks}
      getPlaylistTracks={getPlaylistTracks}
      getTopTracks={getTopTracks}
      getResults={getResults}
      getSubResults={getSubResults}
      addPlaylistId={addPlaylistId}
      savePlaylist={savePlaylist}
      theme={theme}
      setTheme={setTheme}
    >
      <div className={`${style.app} ${themeStyle[theme]}`}>
        {token.access_token && <Header />}
        <main className={style.main}>
          {!token.access_token && <button onClick={handleLogin}>Let's JamMming!</button>}
          {token.access_token && (<>
            {userProfile && <h1>{userProfile.display_name}</h1>}
            <SearchBar />
            {searchResult !== null && <SearchResults />}
            {playlists !== null && <Playlists />}
            <CurrentSelection />
          </>)}
        </main>
        <footer><h5>Made by my love for Music</h5></footer>
      </div>
    </MyProviders>
  );
}

export default App;
