import style from "../styles/searchBar.module.css";
import buttonStyles from "../styles/button.module.css";
import { useState, useCallback, useEffect, useContext, useRef } from "react";
import CurrentUserContext from "../UserContext";
import searchBtn from "../svg/search.svg";
import filterBtn from "../svg/filter.svg";
import themeStyle from "../styles/theme.module.css";
import ThemeContext from "../ThemeContext";

function SearchBar() {
    const filtersRef = useRef(null);
    const { token, search, genres } = useContext(CurrentUserContext);
    const {theme} = useContext(ThemeContext);
    const [term, setTerm] = useState('');
    const [query, setQuery] = useState({
        album: '',
        artist: '',
        track: '',
        genre: '',
    });
    const [selectedType, setSelectedType] = useState('album');
    const [showFilters, setShowFilters] = useState(false);

    const handleChangeTerm = useCallback((e) => {
        setTerm(e.target.value);
    }, []);

    const types = ["album", "artist", "playlist", "track", "show", "episode", "audiobook"];

    const handleChangeFilter = useCallback((e) => {
        const key = e.target.id.replace('filter-', '');
        setQuery(pre => ({
            ...pre,
            [key]: e.target.value
        }));
    }, []);

    const handleChangeType = useCallback((e) => {
        setSelectedType(pre => e.target.value);
    }, []);

    const handleSearch = useCallback(() => {
        if (term !== '' || query.album !== '' || query.artist !== '' || query.track !== '' || query.genre !== '') {
            const queryString = `${term}${query.album !== '' && (selectedType === 'album' || selectedType === 'track') ? ' album:' + query.album : ''}${query.artist !== '' && (selectedType === 'album' || selectedType === 'artist' || selectedType === 'track') ? ' artist:' + query.artist : ''}${query.genre !== '' && (selectedType === 'artist' || selectedType === 'track') ? ' genre:' + query.genre : ''}${query.track !== '' ? ' track:' + query.track : ''}`;
            const queryEncoded = queryString.replace(/ /g, '%2520').replace(/:/g, '%3A');
            search(queryEncoded, selectedType, token);
        }
    }, [term, query, selectedType, search, token], [])

    const handleShowFilters = useCallback(() => {
        setShowFilters(pre => !pre);
    }, [])

    const filterHeight = useCallback(() => {
        const filters = filtersRef.current;
        const height = filters.firstChild.offsetHeight;
        showFilters ? filters.style.setProperty('--height', `${height}px`) : filters.style.setProperty('--height', '0px');

    }, [showFilters, selectedType])

    function capitalizeFirstChar(inputString) {
        // Check if the input string is not empty
        if (inputString.length > 0) {
            // Convert the first character to uppercase and concatenate the rest of the string
            return inputString.charAt(0).toUpperCase() + inputString.slice(1);
        }
        // If the input string is empty, return it as is
        return inputString;
    }

    useEffect(() => {
        filterHeight();
        window.addEventListener('resize', filterHeight);
        return (() => {
            window.removeEventListener('resize', filterHeight)
        })
    }, [filterHeight]);

    return (
        <div className={`${style.container} ${themeStyle[theme]}`}>
            <div className={`${style.search}`}>
                <input type="text" value={term} placeholder="search for terms" onChange={handleChangeTerm} />
                <select value={selectedType} onChange={handleChangeType}>
                    {types.map(item => <option key={'type_' + item} value={item}>{capitalizeFirstChar(item)}</option>)}
                </select>
                <div className={style.buttons}>
                    <button className={buttonStyles.button} onClick={handleSearch}><img src={searchBtn} alt="search button" /></button>
                    <button className={buttonStyles.button} onClick={handleShowFilters}><img src={filterBtn} alt="filter button" /></button>
                </div>
            </div>
            <div ref={filtersRef} className={style['filters-container']}>
                <div className={style.filters}>
                    {(selectedType === 'album' || selectedType === 'track') && <label htmlFor="filter-album">album: 
                        <input id="filter-album" type="text" value={query.album} onChange={handleChangeFilter} /></label>}
                    {(selectedType === 'album' || selectedType === 'artist' || selectedType === 'track') && <label htmlFor="filter-artist">artist: 
                        <input id="filter-artist" type="text" value={query.artist} onChange={handleChangeFilter} /></label>}
                    {(selectedType === 'artist' || selectedType === 'track') && (<label htmlFor="filter-genre">genre: 
                        <input list="genre" id="filter-genre" type="text" value={query.genre} onChange={handleChangeFilter} />
                        <datalist id="genre">
                            {genres.map(genre => <option key={'genre_' + genre} value={genre}></option>)}
                        </datalist>
                    </label>)}
                    <label htmlFor="filter-track">track: 
                        <input id="filter-track" type="text" value={query.track} onChange={handleChangeFilter} /></label>
                </div>
            </div>
        </div>
    );
}

export default SearchBar;