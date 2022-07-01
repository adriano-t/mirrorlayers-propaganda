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

  failed: boolean;

  constructor(private propa: PropagandaService,
    private nav:NavController,
    private loader: LoadingController,
    private route: ActivatedRoute) { }

  ngOnInit() {
  
    if(this.route.snapshot.queryParams.failed)
      this.failed = true;

    this.loader.create({
      message: "Checking login status..."
    }).then((el)=> {
      
      el.present();

      this.propa.checkLogin()
      .subscribe({
        next: (success) => { 
          el.dismiss();
          if(success) {
            const params = this.route.snapshot.queryParams;
            console.log("logged in, redirecting: ", params);
            this.nav.navigateForward(params.redirect || "/");
          } else {
            console.log("not logged in");
          }
        },
        error: (error)=>{
          console.error(error);
          el.dismiss();
        }
      });
    })
  }

  onClickLogin() {
    this.propa.login();
    // .subscribe((success) => { 
    //   if(success)
    //     this.nav.navigateForward("/"); 
    // });
  }

}
