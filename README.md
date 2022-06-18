# mirrorlayers-propaganda
Propaganda Client

## TODO
- Add loader on comment send
- check loaders: dismiss in case of failure
- auto-follow when comment
- load more comments button
- load more posts/comments on profile
- notifications for received likes
- delete notification
- send report
- toast notifications
- change server button

## Requirements

> tested on Node 16

1. Angular CLI
    npm install -g @angular/cli
2. Ionic CLI (6.19)
    npm install -g @ionic/cli
3. Install the required packages
    npm i

## Getting started

- Run on Browser
    ionic serve

## Potential issues
- if after installation shows
    Cannot find module '.../iconv-lite/lib/index.js'. Please verify that the package.json has a valid "main" entry
    Delete the node_modules, package-lock.json and re-run npm i