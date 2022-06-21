# Propaganda Client

## To do
- hide comments marked as spoiler and the ones with enigma > my enigma
- button to view a comment in context if we click from a profile
- auto-follow when comment
- refresh notifications in background
- show a red dot on the notification icon
- notifications for received likes
- show an alert when you have no more likes
- check loaders: dismiss in case of failure

## Bugs
- cores are not refreshed when a like is sent

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