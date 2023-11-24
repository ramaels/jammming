import style from "../styles/album.module.css";
import searchResults from "../styles/searchResults.module.css";
import { useEffect, useState, useContext } from "react";
import CurrentUserContext from "../UserContext";
import TracksScroll from "./TracksScroll";
import AddRemoveButton from "./AddRemoveButton";
import Arrow from "./Arrow";
import Track from "./Track";
import Pagination from "./Pagination";

function Album({ item }) {
    const [albumTracks, setAlbumTracks] = useState(null);
    const { token, getAlbumTracks } = useContext(CurrentUserContext);

    useEffect(() => {
        if (!albumTracks && localStorage.getItem(`albumTracks_${item.id}_state`) !== 'true') {
            localStorage.setItem(`albumTracks_${item.id}_state`, 'true');
            getAlbumTracks(item, token).then(setAlbumTracks).then(() => {
                setAlbumTracks(pre => {
                    const newArr = pre.tracks.items.map(track => ({
                        ...track,
                        album: item,
                        popularity: pre.popularity
                    }));
                    return ({
                        ...pre,
                        tracks: {
                            ...pre.tracks,
                            items: newArr
                        }
                    });
                });
                localStorage.removeItem(`albumTracks_${item.id}_state`);
            });
        }
    }, [getAlbumTracks, item, token, albumTracks]);
    return (
        <>
            <section className={style.section}>
                <img title={item.name} src={item.images[2].url} width={item.images[2].width} height={item.images[2].height} alt={'album ' + item.name} />
                <article>
                    <div>
                        <h5>
                            {item.name}
                        </h5>
                        {albumTracks && <AddRemoveButton item={albumTracks.tracks.items} playlistTrack={false} />}
                    </div>
                    <p>{item.album_type}(<em>release date: {item.release_date}</em>) featuring {item.total_tracks} tracks by {item.artists.map((artist, i, arr) => <span key={artist.id + i}>{i === 0 ? '' : i < (arr.length - 1) ? ', ' : ' and '}<strong>{artist.name}</strong></span>)}</p>
                    {albumTracks && <TracksScroll albumTracks={albumTracks} />}
                </article>
                <Arrow img="circle_down" />
            </section>
            <div className={searchResults.list}>
                <div>
                    <div className={searchResults['track-results']}>
                        {albumTracks && albumTracks.tracks.items.map(item => <Track key={'search_album_track' + item.id} item={item} />)}
                    </div>
                    {albumTracks && <Pagination data={albumTracks.tracks} update={setAlbumTracks} />}
                </div>
            </div>
        </>
    )
}

export default Album;