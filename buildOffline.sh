#!/usr/bin/env bash

set -euo pipefail

sha7="$(git rev-parse --short=7 HEAD)"

rm -rf SerialTerminalOffline-* SerialTerminalOffline-*.zip

yarn install --immutable

yarn build

if [[ ! -d build ]]; then
	echo "Expected build output directory 'build' was not created."
	exit 1
fi

cp -f LICENSE build/LICENSE

cp -f README.md build/README.md

sed -i -E 's#(href|src)="/([^"]+)#\1="./\2#g' build/index.html

sed -i -E 's/ crossorigin//g' build/index.html

sed -i -E 's/<script type="module"/<script defer/g' build/index.html

sed -i -E "s#([\"'])/([^\"']+)#\\1./\\2#g" build/assets/index-*.js

sed -i -E "s/name:\\s*\"dev\"/name:\"Offline Capable Static Build ${sha7}\"/g" build/assets/index-*.js

sed -i -E 's|Download an offline capable version from the|Open the live build at|g' build/assets/index-*.js

sed -i -E 's|latest release on GitHub|serial.namelessnanashi.dev|g' build/assets/index-*.js

sed -i -E 's|https://github.com/NanashiTheNameless/SerialTerminal/releases/latest|https://serial.namelessnanashi.dev|g' build/assets/index-*.js

mv build SerialTerminalOffline-"${sha7}"

zip -r "SerialTerminalOffline-${sha7}.zip" "SerialTerminalOffline-${sha7}"
