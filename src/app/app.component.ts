import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Profile, PropagandaService } from './services/propaganda.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  
  profile: Profile;
  sub: Subscription;

  constructor(
    private propaganda: PropagandaService,
    private nav: NavController,
    private menu: MenuController) {}

  ngOnInit(): void {
    this.sub = this.propaganda.profileCallback.subscribe((data) => {
      this.profile = data;
    }); 

  }

  onToggleChange(event) {
    const checked = event.detail.checked;
    this.toggleDarkTheme(checked);
  } 

  toggleDarkTheme(shouldAdd) {
    document.body.classList.toggle('dark', shouldAdd);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  
  visitProfile() {
    this.nav.navigateForward(["/profile/", this.profile.id]);
    this.menu.close();
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
