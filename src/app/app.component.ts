import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { PropagandaService } from './services/propaganda.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private propaganda: PropagandaService,
    private nav: NavController,
    private menu: MenuController) {}

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
