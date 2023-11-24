class Spotify {
    constructor(length, clientId, redirectUri,) {
        this._length = length;
        this._clientId = clientId;
        this._redirectUri = redirectUri;
        this._possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this._values = null;
        this._codeVerifier = null;
        this._scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';
        this._authUrl = new URL("https://accounts.spotify.com/authorize");
    }

    get codeVerifier() {
        return this._codeVerifier;
    }

    get authUrl() {
        return this._authUrl;
    }

    get clientId() {
        return this._clientId;
    }

    get redirectUri() {
        return this._redirectUri;
    }

    get scope() {
        return this._scope;
    }

    set codeVerifier(x) {
        this._codeVerifier = x;
    }

    generateRandomString(length) {
        this._values = new Uint8Array(length);
        window.crypto.getRandomValues(this._values);
        return this._values.reduce((acc, x) => acc + this._possible[x % this._possible.length], "");
    }

    generateCodeVerifier() {
        this._codeVerifier = this.generateRandomString(this._length);
    }

    async sha256(plain) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return digest;
    }

    base64encode(input) {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    generateCodeChallenge() {
        const hashed = this.sha256(this._codeVerifier);
        this._codeChallenge = hashed.then(digest => this.base64encode(digest));
        return this._codeChallenge;
    }

    async getToken(code) {
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: this._clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: this._redirectUri,
                code_verifier: this._codeVerifier,
            }),
        }

        const url = 'https://accounts.spotify.com/api/token';
        localStorage.setItem('connect_state', 'pending');

        return await fetch(url, payload).then(body => body.json()).then(response => {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            localStorage.setItem('expires_in', response.expires_in);
            localStorage.removeItem('connect_state');
            return response;
        });
    }

    async refreshToken(token) {
        // Implement token refresh logic here
        // For example, fetch a new token and update headers or local storage
        const url = "https://accounts.spotify.com/api/token";

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: token.refresh_token,
                client_id: this._clientId
            }),
        }
        localStorage.setItem('refresh_state', 'false');
        return await fetch(url, payload)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.removeItem('refresh_state');
                return data;
            });
    }

    async fetchWithRetry(url, token, options, retryCount = 1) {
        const response = await fetch(url, options);
        if (response.status === 401 && retryCount > 0) {
            const newToken = await this.refreshToken(token);
            console.log("Refreshed token:", newToken);
            // Retry with the new token and updated otions. No need to change the Url.
            const payload = {
                headers: {
                  Authorization: `Bearer ${newToken.access_token}`
                }
              };
          
            return this.fetchWithRetry(url, newToken, payload, retryCount - 1);
        } 
        else if (!response.ok && retryCount === 0) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return { data, token };
    }
}

export default Spotify;
