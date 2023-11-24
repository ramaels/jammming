import { useCallback, useRef } from "react";
import style from "../styles/album.module.css";
import arrows from "../styles/arrow.module.css";

function TracksScroll({ albumTracks }) {
    const scrollContainer = useRef(null);
    const scrollInterval = useRef(null);
    const scrollLeft = useCallback(() => {
        if (scrollInterval.current) return; // Prevent multiple intervals

        scrollInterval.current = setInterval(() => {
            if (scrollContainer.current) {
                const maxScrollLeft = scrollContainer.current.scrollWidth - scrollContainer.current.clientWidth;
                scrollContainer.current.scrollLeft += 10; // Adjust the value as needed

                if (scrollContainer.current.scrollLeft >= maxScrollLeft) {
                    clearInterval(scrollInterval.current);
                    scrollInterval.current = null;
                }
            }
        }, 100); // Adjust the interval time as needed
    }, []);

    const scrollRight = useCallback(() => {
        if (scrollInterval.current) return; // Prevent multiple intervals

        scrollInterval.current = setInterval(() => {
            if (scrollContainer.current) {
                scrollContainer.current.scrollLeft -= 10; // Adjust the value as needed

                if (scrollContainer.current.scrollLeft <= 0) {
                    clearInterval(scrollInterval.current);
                    scrollInterval.current = null;
                }
            }
        }, 100); // Adjust the interval time as needed
    }, []);

    const stopScroll = useCallback(() => {
        if (scrollInterval.current) {
            clearInterval(scrollInterval.current);
            scrollInterval.current = null;
        }
    }, []);

    return (
        <div className={style['tracks-container']}>
            <div
                onMouseDown={scrollLeft}
                onMouseUp={stopScroll}
                onMouseLeave={stopScroll}
                className={`${arrows.arrow} ${arrows.left}`}
                role="button"
            ></div>
            <div ref={scrollContainer} className={style['tracks-screen']}>
                <p className={style.tracks}>
                    {albumTracks.tracks ? albumTracks.tracks.items.map((item, i) => item.track && item.track !== 'undefined' ? 'track ' + ++i + ' - ' + item.track.name :  'track ' + item.track_number + ' - ' + item.name).join(' | ') : null}
                    {albumTracks.items ? albumTracks.items.map((item, i) => item.track ? 'track ' + ++i + ' - ' + item.track.name : null).join(' | ') : null}
                </p>
            </div>
            <div
                onMouseDown={scrollRight}
                onMouseUp={stopScroll}
                onMouseLeave={stopScroll}
                className={`${arrows.arrow} ${arrows.right}`}
                role="button"
            ></div>
        </div>
    )
}
export default TracksScroll;