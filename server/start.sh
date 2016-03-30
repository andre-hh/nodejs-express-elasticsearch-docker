#!/bin/bash

cd /home/app
npm install

while ! curl http://elasticsearch:9200; do sleep 1; done;

nodemon -L /home/app
