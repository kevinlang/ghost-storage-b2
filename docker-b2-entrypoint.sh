#!/bin/bash
set -e

rm -rf "$GHOST_CONTENT/adapters/storage/b2/"
mkdir -p "$GHOST_CONTENT/adapters/storage/"
cp -r "$GHOST_INSTALL/content.orig/adapters/storage/b2/" "$GHOST_CONTENT/adapters/storage/"

exec docker-entrypoint.sh "$@"
