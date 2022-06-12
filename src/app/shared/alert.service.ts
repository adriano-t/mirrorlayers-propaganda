import { Injectable } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertCtrl: AlertController) { }

  async show(header: string, subHeader: string, message: string, buttons: AlertButton[] | any[]) {

    const alert = await this.alertCtrl.create({ 
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons
    }) 
    
    alert.present();
  }
}
