import { useState, useContext, useCallback } from "react";
import CurrentUserContext from "../UserContext";
import buttonStyles from "../styles/button.module.css";

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
            {!selected ? <div className={`${buttonStyles.edit} ${buttonStyles.btn}`} onClick={editPlaylist} role="button"></div> :
            <div className={`${buttonStyles.remove} ${buttonStyles.btn}`} onClick={removePlaylist} role="button"></div>}
        </>
    )
}
export default EditRemove;