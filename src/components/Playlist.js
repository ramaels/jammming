import React, { useState, useEffect, useContext } from "react";
import style from "../styles/playlist.module.css";
import searchResults from "../styles/searchResults.module.css";
import CurrentUserContext from "../UserContext";
import TracksScroll from "./TracksScroll";
import Arrow from "./Arrow";
import Track from "./Track";
import Pagination from "./Pagination";
import AddRemoveButton from "./AddRemoveButton";
import EditRemove from "./EditRemove";
import themeStyle from "../styles/theme.module.css";
import ThemeContext from "../ThemeContext";

function Playlist({ playlist, container = null }) {
    const [playlistTracks, setPlaylistTracks] = useState(null);
    const { token, getPlaylistTracks } = useContext(CurrentUserContext);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        if ((!playlistTracks || playlist.tracks.total !== playlistTracks.tracks.total) && !localStorage.getItem(`playlisTracks_${playlist.id}_state`)) {
            localStorage.setItem(`playlisTracks_${playlist.id}_state`, 'true');
            getPlaylistTracks(playlist, token).then(data => ({ tracks: data })).then(setPlaylistTracks).then(() => {
                localStorage.removeItem(`playlisTracks_${playlist.id}_state`);
            });
        }
    }, [getPlaylistTracks, playlistTracks, playlist, token]);

    return (<>
        <section className={`${style.playlist} ${themeStyle[theme]}`}>
            <figure>
                {playlist.images[0] && <img src={playlist.images[0].url} height={playlist.images[0].height} width={playlist.images[0].width} alt={playlist.name} />}
                <figcaption>
                    <h5>{playlist.name} | {playlist.tracks.total} tracks{!container ? playlistTracks && <AddRemoveButton item={playlistTracks.tracks.items.map(item => item.track)} playlistTrack={false} /> : <EditRemove playlist={playlist} playlistTracks={playlistTracks} />}</h5>
                    {playlistTracks && <TracksScroll albumTracks={playlistTracks} />}
                </figcaption>
            </figure>
            <Arrow img="circle_down" container={container} />
        </section>
        <div className={searchResults.list}>
            <div>
                <div className={searchResults['track-results']}>
                    {playlistTracks && playlistTracks.tracks.items && playlistTracks.tracks.items.length > 0 && playlistTracks.tracks.items.map((item, i) => item.track ? <Track key={'playlist_track' + i + item.track.id} item={item.track} /> : null)}
                </div>
                {playlistTracks && <Pagination data={playlistTracks.tracks} update={setPlaylistTracks} />}
            </div>
        </div>
    </>)
}

export default Playlist;