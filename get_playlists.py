import requests


def get_playlists():
    USER_ID = input("enter user id")

    PLAYLISTS_TOKEN= input("Go to to get token https://developer.spotify.com/console/get-current-user-playlists/?limit=&offset=")

    URL = 'https://api.spotify.com/v1/users/{}/playlists'.format(USER_ID)


    HEADERS={
        'Authorization': "Bearer {}".format(PLAYLISTS_TOKEN)
    }




    r = requests.get(url=URL,headers=HEADERS)
    y = r.json()

    #For now prints out items on the terminal/eventually want to make CLI to choose playlist directly
    for i in y['items']:
        print(i['name']+': '+i['id'])



