import { useCallback } from "react";
import style from "../styles/arrow.module.css";
import searchResultStyle from "../styles/searchResults.module.css";

function Arrow({ img, container }) {
    const handleArrow = useCallback((e) => {
        e.target.classList.toggle(style.clicked);
        const list = e.target.parentElement.nextSibling;
        list.classList.toggle(searchResultStyle['list-down']);

        e.target.classList.contains(style.clicked) ? list.style.setProperty('height', list.firstChild.offsetHeight + 'px') : list.style.setProperty('height', '0px');
        setTimeout(() => {
            if (container) {
                container.current.style.setProperty('height', container.current.firstChild.offsetHeight + 'px');
            }
        }, 500);
    }, [container]);
    return (<div className={`${style.arrow} ${img==='down' ? style.down : img==='circle_down' ? style['circle-down'] : ''}`} onClick={handleArrow}>
    </div>);
}

export default Arrow;