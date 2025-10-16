#!/usr/bin/env bash

sha="$(git rev-parse --short=8 HEAD)"

npm install

npm run build

sed -i -E 's/(href|src)="\/([^/])/\1=".\/\2/g' build/index.html

sed -i -E "s/name:\s*\"dev\"/name:\"Offline Capable Static Build ${sha}\"/g" build/static/js/main.*.js

mv build SerialTerminalOffline-${sha}

zip -r "SerialTerminalOffline-${sha}.zip" "SerialTerminalOffline-${sha}"
