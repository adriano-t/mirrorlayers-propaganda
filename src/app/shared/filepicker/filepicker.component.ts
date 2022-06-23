import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRadioGroup, ModalController } from '@ionic/angular';
import { PropagandaService } from 'src/app/services/propaganda.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-filepicker',
  templateUrl: './filepicker.component.html',
  styleUrls: ['./filepicker.component.scss'],
})
export class FilepickerComponent implements OnInit {

  picked: string;
  isLoading = false;
  files: string[] = [];

  constructor(
    private modalCtrl: ModalController,
    private propaganda: PropagandaService,
    private alert: AlertService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.propaganda.getSentFiles().subscribe((result) => {
      this.isLoading = false;
      if(result.success) {
        this.files = result.files;
      }
    }, (error)=> {
      this.alert.show("Error", null, "Server error, impossible to load files", ["OK"]);
      this.isLoading = false;
    })
  }

  onSelect(event) {
    this.picked = event.detail.value;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.picked, 'confirm');
  }
  
}
