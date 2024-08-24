#!/bin/bash
set -e
# Start the application
yarn install --frozen-lockfile
yarn run build
yarn start
