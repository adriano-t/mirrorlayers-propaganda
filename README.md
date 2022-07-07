# Propaganda Client

## To do
- notifications for received likes
- show a more specific alert when you finished the cores instead of "impossible to like"
- Edit Profile (Popup Modal)


## Tests
- check loaders: dismiss in case of failure

## Bugs
- samsung s8 theme only white (maybe old version of webview)
- Sort by non si memorizza cambiando pagina
- cores are not refreshed when a like is sent
- user should not be able to report themselves
- if login from profile page, when you press back you'll go to auth page again
- Error [WEB] push notification is not implemented in web
- Error [WEB] StatusBar is not implemented in web


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
    npm run serve

- Build on Browser
    npm run prod

- Run on Android
    npm run serve:android

- Build Android
    npm run prod:android

## Generate Icons
npm install cordova-res -g
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy

## Potential issues
- if after installation shows 
    > `Cannot find module '.../iconv-lite/lib/index.js'. Please verify that the package.json has a valid "main" entry`
   
    Delete the node_modules, package-lock.json and re-run `npm i`

## Info
- Push notifications
  - https://capacitorjs.com/docs/guides/push-notifications-firebase


`npx cap copy`
`npx cap sync`
`npx cap open android` open the project in Android Studio

- To allow steam and website navigation inside the app webview
  > capacitor.config.json
  "server": {
    // Capacitor to open URLs belonging to these hosts inside its WebView.
    "allowNavigation": [
      "example.org",
      "*.example.org",
      "192.0.2.1"
    ]
  }

- To prevent err_cleartext_not_permitted
    <application android:usesCleartextTraffic="true">

## Info
`https://firebase.google.com/docs/cloud-messaging/send-message#rest_5`
`https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages`