import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Capacitor } from '@capacitor/core';
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

}
