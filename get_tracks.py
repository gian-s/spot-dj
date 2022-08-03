import requests
import os


def get_tracks():

    chosen_one = input("Enter the playlist id ")
    TRACKS_URL='https://api.spotify.com/v1/playlists/'+chosen_one+'/tracks'

    TRACKS_TOKEN = input('Get Auth token from https://developer.spotify.com/console/get-playlist/')

    HEADERS={
        'Authorization': "Bearer {}".format(TRACKS_TOKEN)
    }

    r = requests.get(url=TRACKS_URL,headers=HEADERS)
    z = r.json()



    #Creates a new folder where songs will be saved 
    if(not os.path.exists('./output')):
        os.mkdir('./output')
    os.chdir('./output')


    playlist_name = input("Input playlist name")

    playlist_name += '.txt'

    f=open(playlist_name,'w+')
    f.close()

    with open(playlist_name,'w') as f:
        for i in z['items']:
            f.write(i['track']['name']+':'+i['track']['artists'][0]['name']+'\n')
             