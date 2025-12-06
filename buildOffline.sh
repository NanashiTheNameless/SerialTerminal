#!/usr/bin/env bash

sha7="$(git rev-parse --short=7 HEAD)"

rm -rf SerialTerminalOffline-* SerialTerminalOffline-*.zip

yarn install

yarn build

cp -f LICENSE build/LICENSE

cp -f README.md build/README.md

sed -i -E 's/(href|src)="\/([^/])/\1=".\/\2/g' build/index.html

sed -i -E 's/ crossorigin//g' build/index.html

sed -i -E 's/<script type="module"/<script defer/g' build/index.html

sed -i -E "s/[\"']\\/([a-zA-Z])/\".\\/\\1/g" build/assets/index-*.js

sed -i -E "s/name:\\s*\"dev\"/name:\"Offline Capable Static Build ${sha7}\"/g" build/assets/index-*.js

mv build SerialTerminalOffline-"${sha7}"

zip -r "SerialTerminalOffline-${sha7}.zip" "SerialTerminalOffline-${sha7}"
