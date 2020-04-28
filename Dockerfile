FROM ghost:3.14.0-alpine

# copy our adapter files into content.orig
COPY LICENSE index.js package.json yarn.lock $GHOST_INSTALL/content.orig/adapters/storage/b2/

# install the storage adapter
RUN cd $GHOST_INSTALL/content.orig/adapters/storage/b2; \
    yarn install --production --no-lockfile

# we have our own entrypoint for force-copying over our storage adapter
# before calling the parent entrypoint
COPY docker-b2-entrypoint.sh /usr/local/bin
ENTRYPOINT ["docker-b2-entrypoint.sh"]

# docker clears out CMD when we define a different ENTRYPOINT,
# so we need to re-specify
CMD ["node", "current/index.js"]
