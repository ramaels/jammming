import { useContext, useState, useEffect } from "react";
import CurrentUserContext from "../UserContext";

import style from "../styles/button.module.css";

function AddRemoveButton({ item, playlistTrack }) {
    const [selected, setSelected] = useState(false);
    const { addItems, removeItems, currentPlaylist } = useContext(CurrentUserContext);
    useEffect(() => {
        if (Array.isArray(item)) {
            const filteredData = item.filter(dataItem => currentPlaylist.tracks.some(trackItem => trackItem.id === dataItem.id));

            setSelected(filteredData.length > 0);
        } else {
            const exists = currentPlaylist.tracks.some(track => track.id === item.id);
            setSelected(exists);
        }
    }, [item, currentPlaylist.tracks,])
    return (<>
        {playlistTrack ? <div className={`${style.btn} ${style.remove}`} onClick={() => { removeItems(item); }} role="button"></div>
            : !selected ?
                <div className={`${style.btn} ${style.add}`} onClick={() => addItems(item, currentPlaylist.tracks)} role="button"></div>
                : <div className={`${style.btn} ${style.remove}`} onClick={() => { removeItems(item); }} role="button"></div>
        }
    </>);
}
export default AddRemoveButton;