#!/bin/bash

while read p; do
    youtube-dl -x "ytsearch:$p" 
    sleep 10
done <playlist.txt