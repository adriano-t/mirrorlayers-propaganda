import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PropagandaService } from '../services/propaganda.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private propa: PropagandaService,
    private nav:NavController) { }

  ngOnInit() {
    
    this.propa.login().subscribe((success) => { 
      if(success)
        this.nav.navigateForward("/"); 
    });
  }

  onClickLogin() {
    this.propa.login().subscribe((success) => { 
      if(success)
        this.nav.navigateForward("/"); 
    });
  }

}
