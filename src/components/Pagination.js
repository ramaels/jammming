import arrows from "../styles/arrow.module.css";
import style from "../styles/pagination.module.css";

import { useContext, useCallback } from "react";
import CurrentUserContext from "../UserContext";

function Pagination({data = null, update = null}) {
    const { token, searchResult, getResults, getSubResults } = useContext(CurrentUserContext);
    const nestedObject = data ? data : Object.values(searchResult)[0];
    const nextUrl = nestedObject.next;
    const previousUrl = nestedObject.previous;
    const total = nestedObject.total;

    const handleNext = useCallback(() => {
        if (nextUrl) {
            data ? getSubResults(nextUrl, token).then(data => update(pre => ({
                ...pre,
                tracks: data
            }))) : getResults(nextUrl, token);
        };
    }, [nextUrl, token, getResults, getSubResults, data, update]);

    const handlePrevious = useCallback(() => {
        if (previousUrl) {
            data ? getSubResults(previousUrl, token).then(data => update(pre => ({
                ...pre,
                tracks: data
            }))) : getResults(previousUrl, token);
        };
    }, [previousUrl, token, getResults, getSubResults, data, update]);

    return (
        <div className={style.container}>
            <div className={`${arrows.arrow} ${arrows.left}`} onClick={handlePrevious}></div>
            <div className={style.pages}>{nestedObject.offset + 1} - {nestedObject.limit + nestedObject.offset > nestedObject.total ? nestedObject.total : nestedObject.limit + nestedObject.offset}</div>
            <div className={`${arrows.arrow} ${arrows.right}`} onClick={handleNext}></div>
        </div>
    )
}
export default Pagination