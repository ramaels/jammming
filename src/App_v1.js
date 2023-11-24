import style from "./styles/app.module.css";

import Spotify from "./utils/Spotify";
import { useState, useCallback, useEffect } from 'react';

import MyProviders from "./MyProviders";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlists from "./components/Playlists";
import CurrentSelection from "./components/CurrentSelection";

const auth = new Spotify(64, '04c4415a520843cd92e8673a3ff41593', 'http://localhost:3000/');

function App() {
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

  const getToken = useCallback((code) => {
    return auth.getToken(code);
  }, []);

  const search = useCallback((query, type, token) => {
    const url = `https://api.spotify.com/v1/search?q=${query}${type !== '' ? '&type=' + type : ''}`;
    const payload = {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    }
    return auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
      if (updatedToken && updatedToken.access_token !== token.access_token) { // Update the token state if it's new
        setToken(updatedToken);
        console.log("Token state updated:", updatedToken);
      }
      return data;
    }).then(setSearchResult);
  }, []);

  const getResults = useCallback((url, token) => {
    const payload = {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    }
    return auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
      if (updatedToken && updatedToken !== token) { // Update the token state if it's new
        setToken(updatedToken);
      }
      return data;
    }).then(setSearchResult);
  }, []);

  const getSubResults = useCallback((url, token) => {
    const payload = {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    }
    return auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
      if (updatedToken && updatedToken !== token) { // Update the token state if it's new
        setToken(updatedToken);
      }
      return data;
    });
  }, []);

  const getUserProfile = useCallback((token) => {
    const url = 'https://api.spotify.com/v1/me';
    const payload = {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    };
    return auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
      if (updatedToken && updatedToken !== token) { // Update the token state if it's new
        setToken(updatedToken);
      }
      return data;
    }).then(setUserProfile).then(() => { localStorage.removeItem('profile_state'); });
  }, []);

  const getGenres = useCallback((token) => {
    const url = "https://api.spotify.com/v1/recommendations/available-genre-seeds";
    const payload = {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    }

    return auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
      if (updatedToken && updatedToken !== token) { // Update the token state if it's new
        setToken(updatedToken);
      }
      return data;
    }).then(data => data.genres);
  }, []);

  const getPlaylists = useCallback((token, user_id) => {
    const url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    const payload = {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    }
    return auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
      if (updatedToken && updatedToken !== token) { // Update the token state if it's new
        setToken(updatedToken);
      }
      return data;
    }).then(setPlaylists);
  }, []);

  const getAlbumTracks = useCallback((item, token) => {
    const url = item.href;
    const payload = {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    }
    return auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
      if (updatedToken && updatedToken !== token) { // Update the token state if it's new
        setToken(updatedToken);
      }
      return data;
    });
  }, []);

  const getPlaylistTracks = useCallback((playlist, token) => {
    const url = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=20`
    const payload = {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    }
    return auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
      if (updatedToken && updatedToken !== token) { // Update the token state if it's new
        setToken(updatedToken);
      }
      return data;
    });
    // return fetch(url, payload).then(body => body.json(), () => null);
  }, []);

  const getTopTracks = useCallback(async (token, artist, userProfile) => {
    const url = `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=${userProfile.country}`;
    const payload = {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    };
    return auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
      if (updatedToken && updatedToken !== token) { // Update the token state if it's new
        setToken(updatedToken);
      }
      return data;
    });
  }, []);

  const savePlaylist = useCallback(async (token) => {
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
        const payload = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access_token}`
          },
          body: JSON.stringify({
            uris: urisArr,
            position: 0
          })
        };
        console.log((payload));
        auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
          if (updatedToken && updatedToken !== token) { // Update the token state if it's new
            setToken(updatedToken);
          }
          // return data;
        });
        getPlaylists(token, userProfile.id);
      }
      if (tracksToRemove.length > 0) {
        const urisArr = tracksToRemove.map(item => ({ uri: item.uri }));
        const payload = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access_token}`
          },
          body: JSON.stringify({
            tracks: urisArr,
            snapshot_id: currentPlaylist.snapshot_id
          })
        };
        console.log((payload));
        auth.fetchWithRetry(url, token, payload).then(({ data, token: updatedToken }) => {
          if (updatedToken && updatedToken !== token) { // Update the token state if it's new
            setToken(updatedToken);
          }
          // return data;
        })
        getPlaylists(token, userProfile.id);
      }
    } else {
      const url1 = `https://api.spotify.com/v1/users/${userProfile.id}/playlists`;
      const payload1 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        },
        body: JSON.stringify({
          name: playlistName,
          description: playlistDescription,
          public: false
        })
      };
      const playlistCreated = await auth.fetchWithRetry(url1, token, payload1).then(({ data, token: updatedToken }) => {
        if (updatedToken && updatedToken !== token) { // Update the token state if it's new
          setToken(updatedToken);
        }
        return data;
      });

      const urisArr = currentPlaylist.tracks.map(item => item.uri);
      const url2 = await `https://api.spotify.com/v1/playlists/${playlistCreated.id}/tracks`;
      const payload2 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        },
        body: JSON.stringify({
          uris: urisArr,
          position: 0
        })
      };
      console.log((payload1, payload2));
      
      await auth.fetchWithRetry(url2, token, payload2).then(({ data, token: updatedToken }) => {
        if (updatedToken && updatedToken !== token) { // Update the token state if it's new
          setToken(updatedToken);
        }
        // return data;
      });
      await getPlaylists(token, userProfile.id);
    }
  }, [playlists, currentPlaylist, userProfile, getPlaylists, playlistName, playlistDescription]);

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
          getPlaylists(token, userProfile.id).then(() => { localStorage.removeItem('playlists_state') });
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
    >
      <div className={style.app}>
        {token.access_token && (<header className="App-header">
          <h1>JAMMING</h1>
        </header>)}
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
