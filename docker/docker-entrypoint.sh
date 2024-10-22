#!/bin/bash
set -e

if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
    yarn install --frozen-lockfile
fi

if [ ! -d "build" ] || [ -z "$(ls -A build)" ]; then
    yarn run build
fi

exec "$@"
