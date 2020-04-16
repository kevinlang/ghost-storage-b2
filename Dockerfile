FROM ghost:3.13.3-alpine

# base image copies everything from content.orig at startup, so let's hook into that
WORKDIR $GHOST_INSTALL/content.orig/adapters/storage/b2

COPY LICENSE index.js package.json yarn.lock ./
RUN yarn install --production --no-lockfile
