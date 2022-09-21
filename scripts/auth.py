#%%
import requests
import base64

# URLS
AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
BASE_URL = 'https://api.spotify.com/v1/'

CLIENT_ID=''
CLIENT_SECRET=''

#%%
provider_url = AUTH_URL

from urllib.parse import urlencode
params = urlencode({
    'client_id': CLIENT_ID,
    'scope': 'playlist-read-private playlist-read-collaborative',
    'redirect_uri': 'http://127.0.0.1:5000/spotify/callback',
    'response_type': 'code'
})

url = provider_url + '?' + params
url

#%%
# Make a request to the /authorize endpoint to get an authorization code
auth_code = requests.get(AUTH_URL, {
    'client_id': CLIENT_ID,
    'response_type': 'code',
    'redirect_uri': 'http://127.0.0.1:5000/spotify/callback',
    'scope': ['playlist-read-private', 'playlist-read-collaborative']
})

#%%
message = f"{CLIENT_ID}:{CLIENT_SECRET}"
messageBytes = message.encode('ascii')
base64Bytes = base64.b64encode(messageBytes)
base64Message = base64Bytes.decode('ascii')

headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + base64Message 
}

payload = {
    'grant_type': 'authorization_code',
    'code':auth_code,
    'redirect_uri': 'http://127.0.0.1:5000/spotify/callback'
}
#%%
# Make a request to the /token endpoint to get an access token
access_token_request = requests.post(url=TOKEN_URL, data=payload, headers=headers)

# convert the response to JSON
access_token_response_data = access_token_request.json()

print(access_token_response_data)

#%%

# save the access token

access_token = access_token_response_data['access_token']

URL = 'https://api.spotify.com/v1/me/playlists'

HEADERS={
        'Authorization': "Bearer {}".format(access_token)
    }

r = requests.get(url=URL,headers=HEADERS)
y = r.json()
print(y)
# %%
for i in y['items']:
    print(i['name']+': '+i['id'])

# %%
