import { useState, useCallback, useContext } from "react";
import CurrentUserContext from "../UserContext";
import style from "../styles/selectionForm.module.css";
import buttonStyles from "../styles/button.module.css";

function SelectionForm({ setShowForm }) {
    const { setPlaylistName, setPlaylistDescription, playlistName, playlistDescription } = useContext(CurrentUserContext);
    const [name, setName] = useState(() => {
        return playlistName !== 'New Playlist Name' ? playlistName : '';
    });
    const [description, setDescription] = useState(() => {
        return playlistDescription !== 'Enter a description...' ? playlistDescription : '';
    });
    const [showWarning, setShowWarning] = useState(false);

    const handleSave = useCallback(() => {
        if (name !== '') {
            const str = description.replace(/(\r\n|\n|\r|\t)/gm, " ");
            setPlaylistName(name);
            setPlaylistDescription(str);
            setShowForm(false);
            document.body.style.overflow = '';
        }
    }, [name, description, setPlaylistName, setPlaylistDescription, setShowForm]);

    return (<div className={style.container}>
        <div className={`${buttonStyles.btn} ${buttonStyles.close} ${style.close}`} onClick={() => { setShowForm(false); document.body.style.overflow = ''; }} role="button"></div>
        <div className={style.form}>
            {showWarning && <div className={style.warning}><div className={style.icon}></div>Newlines will be converted to spaces.</div>}
            <input onChange={(e) => { setName(e.target.value) }} placeholder="New Playlist Name" type="text" value={name} />
            <textarea rows={'4'} placeholder="Enter a description..." onChange={(e) => {
                let matches = e.target.value.match(/(\r\n|\n|\r|\t)/gm);
                setDescription(e.target.value);
                matches ? setShowWarning(true) : setShowWarning(false);
            }} type="text" value={description} />
            <button className={buttonStyles.button} onClick={handleSave}>save</button>
        </div>
    </div>);
}
export default SelectionForm;