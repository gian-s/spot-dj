from flask import Flask, redirect, url_for, session, request

import spotipy
from spotipy.oauth2 import SpotifyOAuth



CLIENT_ID=''
CLIENT_SECRET=''


app = Flask(__name__)
app.secret_key = 'development'
app.config['SESSION_COOKIE_NAME'] = 'Giancas Cookie'

@app.route("/")
def login():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route("/redirect")
def redirectApp():
    return 'redirect'


@app.route("/getPlaylists")
def getPlaylists():
    return 'set of playlists'



def create_spotify_oauth():
    return SpotifyOAuth(
        client_id = CLIENT_ID,
        client_secret=CLIENT_SECRET,
        redirect_uri=url_for('redirectApp',_external=True),
        scope='playlist-read-private playlist-read-collaborative'

    )