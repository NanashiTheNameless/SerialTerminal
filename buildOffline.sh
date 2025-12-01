#!/usr/bin/env bash

sha="$(git rev-parse --short=8 HEAD)"

yarn install

yarn build

cp -f LICENSE build/LICENSE

sed -i -E 's/(href|src)="\/([^/])/\1=".\/\2/g' build/index.html

sed -i -E 's/ crossorigin//g' build/index.html

sed -i -E 's/<script type="module"/<script defer/g' build/index.html

sed -i -E "s/[\"']\\/([a-zA-Z])/\".\\/\\1/g" build/assets/index-*.js

sed -i -E "s/name:\\s*\"dev\"/name:\"Offline Capable Static Build ${sha}\"/g" build/assets/index-*.js

mv build SerialTerminalOffline-"${sha}"

zip -r "SerialTerminalOffline-${sha}.zip" "SerialTerminalOffline-${sha}"
