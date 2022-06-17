import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private loader: LoadingController,
    private route: ActivatedRoute) { }

  ngOnInit() {
   
    this.loader.create({
      message: "Logging in..."
    }).then((el)=> {
      
      el.present();

      this.propa.login().subscribe((success) => { 
        el.dismiss();
        if(success) {
          const params = this.route.snapshot.queryParams;
          console.log(params);
          this.nav.navigateForward(params.redirect || "/");
        }
      },
      (error)=>{
        console.log(error);
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
