import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { PropagandaService } from '../services/propaganda.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private propa: PropagandaService,
    private nav:NavController,
    private loader: LoadingController) { }

  ngOnInit() {
    
    this.loader.create({
      message: "Logging in..."
    }).then((el)=> {

      el.present();

      this.propa.login().subscribe((success) => { 
        console.log("dismiss");
        el.dismiss();
        if(success)
          this.nav.navigateForward("/");
      },
      (error)=>{
        el.dismiss();
      });
    })
  }

  onClickLogin() {
    this.propa.login().subscribe((success) => { 
      if(success)
        this.nav.navigateForward("/"); 
    });
  }

}
