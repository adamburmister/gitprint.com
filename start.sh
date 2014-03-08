#!/bin/sh

if [ $(ps -e -o uid,cmd | grep $UID | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
        export PATH=/usr/local/bin:$PATH
        NODE_ENV=production PORT=1337 forever start --sourceDir /srv/gitprint.com/bin www >> /var/log/gitprint.com.txt 2>&1
fi