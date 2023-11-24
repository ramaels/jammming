import {useState} from "react";

function PlaylistScene() {
    const [playlistScene, setPlaylistScene] = useState({
        title:"New Playlist",
        description: "Music speaks louder than words...",
        public: false,
    });
    return (<div>
        <h2>{playlistScene.title}</h2>
        <p>{playlistScene.description}</p>
    </div>);
}

export default PlaylistScene;