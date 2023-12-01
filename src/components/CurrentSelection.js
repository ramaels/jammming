import style from "../styles/currentSelection.module.css";
import buttonStyles from "../styles/button.module.css";
import { useContext, useState } from "react";
import CurrentUserContext from "../UserContext";
import Track from "./Track";
import SelectionForm from "./SelectionForm";
import themeStyle from "../styles/theme.module.css";
import ThemeContext from "../ThemeContext";

function CurrentSelection() {
    const { theme } = useContext(ThemeContext);
    const [showForm, setShowForm] = useState(false)

    const { token, currentPlaylist, playlistName, playlistDescription, savePlaylist } = useContext(CurrentUserContext);
    return (
        <div className={`${style.selection} ${themeStyle[theme]}`}>
            <h2>Current Selection</h2>
            {showForm && <SelectionForm
                setShowForm={setShowForm}
            />}
            <div className={style.details}>
                <div className={`${buttonStyles.btn} ${buttonStyles.edit}`} onClick={() => { setShowForm(true); document.body.style.overflow = 'hidden'; }}></div>
                <h3>{playlistName}</h3>
                <h4>{playlistDescription}</h4>
                {playlistName !== 'New Playlist Name' && <button className={buttonStyles.button} onClick={() => { savePlaylist(token) }}>save</button>}
            </div>
            <div>
                <div className={style.tracks}>
                    {currentPlaylist.tracks.length === 0 && <h3>Please search Spotify or browse your playlist(s) to select tracks to create a new playlist, or edit your playlist(s).</h3>}
                    {currentPlaylist.tracks.length > 0 && currentPlaylist.tracks.map(item => <Track key={'current_track_' + item.id} item={item} playlistTrack={true} />)}
                </div>
            </div>
        </div>
    );
}
export default CurrentSelection;