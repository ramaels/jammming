import { useContext, useRef } from "react";
import CurrentUserContext from "../UserContext";
import Playlist from "./Playlist";
import style from "../styles/playlists.module.css";
import arrowStyles from "../styles/searchResults.module.css";
import Arrow from "./Arrow";

function Playlists() {
    const { playlists } = useContext(CurrentUserContext);
    const container = useRef(null);
    console.log(playlists);

    return (<div className={`${style.playlists}`}>
        <div className={arrowStyles.title}><h2>Your Playlists </h2><Arrow img="down" /></div>
        {playlists && <div ref={container} className={arrowStyles.list}>
            <div>
            {playlists.items.map(item => (<Playlist key={'playlist_' + item.name} playlist={item} container={container} />))}
            </div>
        </div>}
    </div>);
}

export default Playlists;