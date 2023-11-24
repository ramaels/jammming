import Popularity from "./Popularity";
import style from "../styles/track.module.css";
import AddRemoveButton from "./AddRemoveButton";

function Track({item, playlistTrack=false}) {
    return (
        <figure className={style.track}>
            {item.album.images[0] && <img title={item.name} src={item.album.images[0].url} width={item.album.images[0].width} height={item.album.images[0].height} alt={'album ' + item.name} />}

            <figcaption>
                <h3>{item.name}</h3> by {item.artists.map((artist, i, arr) => <span key={'track_' + item.id + artist.id + i}>{i === 0 ? '' : i < (arr.length - 1) ? ', ' : ' and '}<strong>{artist.name}</strong></span>)}
                <p>From the {item.album.album_type} "{item.album.name}"(<em>release date: {item.album.release_date}</em>) featuring {item.album.total_tracks} tracks by {item.album.artists.map((artist, i, arr) => <span key={item.id + artist.id + i}>{i === 0 ? '' : i < (arr.length - 1) ? ', ' : ' and '}<strong>{artist.name}</strong></span>)}.</p>
                <p>Track number {item.track_number} on disc number {item.disc_number}</p>
            </figcaption>
            <section>
                <Popularity num={item.popularity} width={32} height={32} />
                <AddRemoveButton item={item} playlistTrack={playlistTrack} />
            </section>
        </figure>
    )
}

export default Track;