import Spotify from "./Spotify";

const auth = new Spotify(64, '04c4415a520843cd92e8673a3ff41593', 'http://localhost:3000/');
let accessToken;

export default auth;