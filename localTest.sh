#!/usr/bin/env bash

yarn install --immutable

yarn dlx update-browserslist-db@latest -y

yarn start
