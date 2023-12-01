import { useState, useEffect, useCallback, useRef } from "react";
import { useContext } from "react";
import CurrentUserContext from "../UserContext";

import style from "../styles/artist.module.css";

import Track from "./Track";

function Artist({ artist }) {
    const bg = useRef(null);
    const fg = useRef(null);
    const tracksContainer = useRef(null);
    const [topTracks, setTopTracks] = useState(null);
    const { token, userProfile, getTopTracks } = useContext(CurrentUserContext);

    const topVar = useCallback(() => {
        if (bg.current.parentElement.offsetHeight < bg.current.parentElement.offsetWidth) {
            bg.current.firstChild && bg.current.firstChild.style.setProperty('width', fg.current.offsetWidth+'px');
            bg.current.firstChild && bg.current.firstChild.style.setProperty('height', 'auto');
            bg.current.style.setProperty('--offset', '-' + (bg.current.offsetHeight - fg.current.offsetHeight - 5) + 'px');
            bg.current.style.setProperty('animation', `${style.vertical} 15s infinite alternate ease-in-out`);
        } else {
            bg.current.firstChild && bg.current.firstChild.style.setProperty('height', fg.current.offsetHeight+'px');
            bg.current.firstChild && bg.current.firstChild.style.setProperty('width', 'auto');
            bg.current.style.setProperty('width', 'auto');
            bg.current.style.setProperty('--offset', '-' + (bg.current.offsetWidth - fg.current.offsetWidth - 5) + 'px');
            bg.current.style.setProperty('animation', `${style.horizontal} 15s infinite alternate ease-in-out`);
        }
    }, []);

    useEffect(() => {
        if (!topTracks && localStorage.getItem(`toptrack_${artist.id}_State`) !== 'true') {
            localStorage.setItem(`toptrack_${artist.id}_State`, 'true');
            getTopTracks(artist, userProfile).then(setTopTracks).then(() => { localStorage.removeItem(`toptrack_${artist.id}_State`) });
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
                <div ref={tracksContainer} className={style.list}>
                    <div>
                        <div className={`${style['track-results']} ${style.tracks}`}>
                            {topTracks && topTracks.tracks.map(item => <Track key={'search_album_track' + item.id} item={item} />)}
                        </div>
                        <div><p>{artist.genres.length > 0 ? artist.genres.join(' | ') : 'Unique Genre'}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Artist;