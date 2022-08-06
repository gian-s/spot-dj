#!/bin/bash

FILES="./*.txt"
for f in $FILES;
do
  awk '/a/ {print $0}' $f >> main.txt
  while read p; do
  youtube-dl --audio-format best -x "ytsearch1:$p"
  done < main.txt
done;