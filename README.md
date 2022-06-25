# Propaganda Client

## To do
- auto-follow when comment
- notifications for received likes
- show an alert when you finished the cores and tried to like
- check loaders: dismiss in case of failure

## Bugs
- cores are not refreshed when a like is sent
- user should not be able to report themselves
- if login from profile page, when you press back you'll go to auth page again

## Requirements

> tested on Node 16

1. Angular CLI \
    `npm install -g @angular/cli`
3. Ionic CLI (6.19) \
    `npm install -g @ionic/cli`
4. Install the required packages \
    `npm i`

## Getting started

- Run on Browser
    ionic serve

## Potential issues
- if after installation shows 
    > `Cannot find module '.../iconv-lite/lib/index.js'. Please verify that the package.json has a valid "main" entry`
   
    Delete the node_modules, package-lock.json and re-run `npm i`

## Info
- Push notifications
  - https://capacitorjs.com/docs/guides/push-notifications-firebase


npx cap copy
npx cap sync