import { useState, useContext, useCallback } from "react";
import CurrentUserContext from "../UserContext";
import style from "../styles/playlist.module.css";
import remove from "../styles/addRemoveButton.module.css";

function EditRemove({ playlist, playlistTracks }) {
    const [selected, setSelected] = useState(false);
    const { setPlaylistName, setPlaylistDescription, addItems, removeItems, addPlaylistId, currentPlaylist } = useContext(CurrentUserContext);
    const editPlaylist = useCallback(() => {
        setSelected(true);
        const data = playlistTracks.tracks.items.map(item => item.track);
        setPlaylistName(playlist.name);
        setPlaylistDescription(playlist.description);
        addItems(data, currentPlaylist.tracks);
        addPlaylistId(playlist.id, data, playlist.snapshot_id);
    }, [currentPlaylist, playlist, playlistTracks, setPlaylistName, setPlaylistDescription, addItems, addPlaylistId]);
    const removePlaylist = useCallback(()=>{
        setSelected(false);
        addPlaylistId(null);
        setPlaylistName('New Playlist Name');
        setPlaylistDescription('Enter a description...');
        const data = playlistTracks.tracks.items.map(item => item.track);
        removeItems(data)
    },[removeItems, addPlaylistId, playlistTracks, setPlaylistName, setPlaylistDescription]);

    return (
        <>
            {!selected ? <div className={style.edit} onClick={editPlaylist} role="button"></div> :
            <div className={`${remove.remove} ${remove.btn}`} onClick={removePlaylist} role="button"></div>}
        </>
    )
}
export default EditRemove;