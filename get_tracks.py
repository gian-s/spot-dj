import requests
import os


TRACKS_URL='https://api.spotify.com/v1/playlists/42RfKkO1XLVjk7Of5t44LG/tracks'

TRACKS_TOKEN = input('Get Auth token from https://developer.spotify.com/console/get-playlist/')

HEADERS={
    'Authorization': "Bearer {}".format(TRACKS_TOKEN)
}

r = requests.get(url=TRACKS_URL,headers=HEADERS)
z = r.json()

z["items"][0]['track']['name'], z["items"][0]['track']['artists'][0]['name']

os.chdir('./output')

playlist_name = input("Input playlist name")

playlist_name += '.txt'

f=open(playlist_name,'w+')
f.close()

with open('BoilerRoom.txt','w') as f:
    for i in z['items']:
        f.write(i['track']['name']+':'+i['track']['artists'][0]['name']+'\n')
    
    