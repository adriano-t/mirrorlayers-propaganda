import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { StatusBar } from '@capacitor/status-bar';
import { IonToggle, MenuController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PreferencesService } from './services/preferences.service';
import { Profile, PropagandaService } from './services/propaganda.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  
  profile: Profile;
  sub: Subscription;

  @ViewChild(IonToggle) toggle: IonToggle;

  constructor(
    private propaganda: PropagandaService,
    private nav: NavController,
    private menu: MenuController,
    private prefs: PreferencesService
    ) {}
  
  ngOnInit(): void {
    
    this.sub = this.propaganda.profileCallback.subscribe((data) => {
      this.profile = data;
    });
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addListener((mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));
 
    this.prefs.onLoad().then(() => {
      let darkTheme = this.prefs.get("dark-theme", true);
      this.toggleDarkTheme(darkTheme);
    });

    //NavigationBar.setColor({color: ""});
    StatusBar?.setOverlaysWebView({ overlay: false }).catch(()=>{});
    
    
    this.initPushNotifications();
    
  }


  onMenuOpen() {
    this.toggle.checked = document.body.classList.contains('dark');
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  visitProfile() {
    this.nav.navigateForward(["/profile/", this.profile.id]);
    this.menu.close();
  }
    
  onToggleDarkMode(event) {
    this.toggleDarkTheme(event.detail.checked);
  }
  
  toggleDarkTheme(shouldAdd) {
    document.body.classList.toggle('dark', shouldAdd);
    this.prefs.set("dark-theme", shouldAdd);
  }
 
  canShowFullscreenButton() {
    return !Capacitor.isNativePlatform();
  }

  onClickFullscreen() {
    document.documentElement.requestFullscreen({navigationUI: 'hide'});
  }

  onClickLogout(){
    this.propaganda.logout().subscribe((success) => {
      if(!success) {
        //popup
      } else {
        this.menu.close("first");
        this.nav.navigateRoot(["/auth"]);
      }
    });
  }

  initPushNotifications() {
    
    if(!Capacitor.isPluginAvailable("PushNotifications"))
      return;

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });
    
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        //send this value to the server
        this.propaganda.subscribeNotifications(token.value).subscribe(success => {
          if(success) {
            console.log("subscribed! " + token.value);
          } else {
            console.log("failed to subscribe! " + token.value);
          }
        });
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        var data = notification.data;
        if(data) {
          alert(JSON.stringify(data));
        } else {
          alert("No notification data :(");
        }
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
        alert("ACTION " + JSON.stringify(notification));
      }
    );
  }

}
