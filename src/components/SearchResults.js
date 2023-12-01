import style from "../styles/searchResults.module.css";
import { useContext } from "react";
import CurrentUserContext from "../UserContext";
import Track from "./Track";
import Arrow from "./Arrow";
import Album from "./Album";
import Artist from "./Artist";
import Playlist from "./Playlist";
import Pagination from "./Pagination";
import themeStyle from "../styles/theme.module.css";
import ThemeContext from "../ThemeContext";

function SearchResults() {
    const { searchResult } = useContext(CurrentUserContext);
    const {theme} = useContext(ThemeContext);
    return (<div className={`${style.tracks} ${themeStyle[theme]}`}>
        {searchResult.tracks && <div className={style.title}><h2>Track Search Results</h2><Arrow img="down" /></div>}
        {searchResult.tracks && <div className={style.list}>
            <div>
                <div>
                    {searchResult.tracks.items.map(item => <Track key={'track_' + item.id} item={item} />)}
                </div>
                <Pagination />
            </div>
        </div>}
        {searchResult.artists && <div className={style.title}><h2>Artist Search Results</h2><Arrow img="down" /></div>}
        {searchResult.artists && <div className={style.list}>
            <div>
                <div className={style.artists}>
                    {searchResult.artists.items.map((item, i) => <Artist key={'searchresults_' + item.id} artist={item} />)}
                </div>
                <Pagination />
            </div>
        </div>}
        {searchResult.albums && <div className={style.title}><h2>Album Search Results</h2><Arrow img="down" /></div>}
        {searchResult.albums && <div className={style.list}>
            <div>
                <div>
                    {searchResult.albums.items.map((item, i) => <Album key={'album_' + item.id} item={item} />)}
                </div>
                <Pagination />
            </div>
        </div>}
        {searchResult.playlists && <div className={style.title}><h2>Playlist Search Results</h2><Arrow img="down" /></div>}
        {searchResult.playlists && <div className={style.list}>
            <div>
                <div>
                    {searchResult.playlists.items.map(item => (<Playlist key={'searchresults_playlist_' + item.id} playlist={item} />))}
                </div>
                <Pagination />
            </div>
        </div>}
        {searchResult.shows && <div className={style.title}><h2>Show Search Results</h2><Arrow img="down" /></div>}
        {searchResult.shows && <div className={style.list}>
            <div>
                <div>
                    {searchResult.shows.items.map(item => (<div key={item.id}>
                        <img title={item.name} src={item.images[0].url} width={item.images[0].width} height={item.images[0].height} alt={'album ' + item.name} />
                    </div>))}
                </div>
                <Pagination />
            </div>
        </div>}
        {searchResult.episodes && <div className={style.title}><h2>Episode Search Results</h2><Arrow img="down" /></div>}
        {searchResult.episodes && <div className={style.list}>
            <div>
                <div>
                    {searchResult.episodes.items.map(item => (<div key={item.id}>
                        <img title={item.name} src={item.images[0].url} width={item.images[0].width} height={item.images[0].height} alt={'album ' + item.name} />
                    </div>))}
                </div>
                <Pagination />
            </div>
        </div>}
        {searchResult.audiobooks && <div className={style.title}><h2>Audiobook Search Results</h2><Arrow img="down" /></div>}
        {searchResult.audiobooks && <div className={style.list}>
            <div>
            <div>
                {searchResult.audiobooks.items.map(item => (<div key={item.id}>
                    <img title={item.name} src={item.images[0].url} width={item.images[0].width} height={item.images[0].height} alt={'album ' + item.name} />
                </div>))}
            </div>
            <Pagination />
            </div>
        </div>}
    </div>);
}

export default SearchResults;