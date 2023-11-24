import { useState, useEffect, useCallback, useRef } from "react";
import { useContext } from "react";
import CurrentUserContext from "../UserContext";

import style from "../styles/artist.module.css";
import searchResults from "../styles/searchResults.module.css";

import Track from "./Track";

function Artist({ artist }) {
    const bg = useRef(null);
    const fg = useRef(null);
    const tracksContainer = useRef(null);
    const [topTracks, setTopTracks] = useState(null);
    const { token, userProfile, getTopTracks } = useContext(CurrentUserContext);

    const topVar = useCallback(() => {
        bg.current.style.setProperty('--top', '-' + (bg.current.offsetHeight - fg.current.offsetHeight - 5) + 'px');
    }, []);

    useEffect(() => {
        if (!topTracks && localStorage.getItem(`toptrack_${artist.id}_State`)!=='true') {
            localStorage.setItem(`toptrack_${artist.id}_State`, 'true');
            getTopTracks( artist, userProfile).then(setTopTracks).then(() => { localStorage.removeItem(`toptrack_${artist.id}_State`) });
        }
        topVar();
        window.addEventListener('resize', topVar);
        tracksContainer.current.style.setProperty('height', 'auto');
        return () => {
            window.removeEventListener('resize', topVar);
        }
    }, [getTopTracks, topTracks, topVar, token, artist, userProfile]);

    return (
        <div className={style.container}>
            <div ref={bg} className={style.image}>{artist.images[0] && <img title={artist.name} src={artist.images[0].url} width={artist.images[0].width} height={artist.images[0].height} alt={'album ' + artist.name} />}</div>
            <div ref={fg} className={style.content}>
                <h2>{artist.name}</h2>
                <div ref={tracksContainer} className={searchResults.list}>
                    <div>
                        <div className={`${searchResults['track-results']} ${style.tracks}`}>
                            {topTracks && topTracks.tracks.map(item => <Track key={'search_album_track' + item.id} item={item} />)}
                        </div>
                        <div>{artist.genres.length > 0 ? artist.genres.join(' | ') : 'Unique Genre'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Artist;