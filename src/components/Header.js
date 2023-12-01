import { useContext } from "react";
import ThemeContext from "../ThemeContext";
import style from "../styles/header.module.css";
import themeStyle from "../styles/theme.module.css";
import buttonStyle from "../styles/button.module.css";

function Header() {
    const {theme, setTheme} = useContext(ThemeContext);

    return (<header className={`${style.header} ${themeStyle[theme]}`}>
        <h1>JAMMING</h1>
        {theme === 'dark' ? 
        <div className={`${buttonStyle.btn} ${buttonStyle.light}`} onClick={()=>{setTheme('light')}}></div> : 
        <div className={`${buttonStyle.btn} ${buttonStyle.dark}`} onClick={()=>{setTheme('dark')}}></div>}
    </header>);
}
export default Header;