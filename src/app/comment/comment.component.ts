import { Component, Input, OnInit, Output } from '@angular/core';
import { ActionSheetController, LoadingController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Comment, LikeType, Profile, PropagandaService, ReportMotivation, ReportType } from '../services/propaganda.service';
import { Translation } from '../services/Translation.model';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
 
  @Input() comment: Comment;
  @Input() profile: Profile;
  @Output() onDelete = new Subject();
  spoiler = false;
  spoilerMessage = "May contain spoilers";
  laterEnigma = false;

  constructor(private propaganda:PropagandaService,
    private alert: AlertService,
    public actionSheetController: ActionSheetController,
    private loader: LoadingController,
    private nav: NavController,
    ) {}

  ngOnInit() {

    this.laterEnigma = +this.comment.enigma > +this.profile.enigma || 
    (+this.comment.enigma == +this.profile.enigma && +this.comment.section > +this.profile.section);

    if(this.spoiler) {
      this.spoilerMessage = "May contain spoilers";
    } else if (this.laterEnigma) {
      this.spoilerMessage = "Sent from a later Enigma";
    }
     this.spoiler = this.comment.spoiler || this.laterEnigma;
  }

  
  onClickLike() {
    if(this.comment.liked)
      return;

    this.propaganda.like(this.comment.id, LikeType.Comment, true).subscribe((success) => {
      if(success) {
        this.comment.liked = true;
        this.comment.likes++;
      } else {
        this.alert.show( 
          'Error',
          null,
          'Impossible to like.',
          ['OK']
        );
        
      }
    });
  }

  
  async presentActionSheet() {

    let buttons = [];
    if(this.comment.author == this.profile.id)
      buttons = [{
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          id: 'delete-button',
          data: {
            type: 'delete'
          },
          handler: () => {
            
            this.loader.create({
              message: "Deleting..."
            }).then((el)=>{
              el.present();

              this.propaganda.delete(+this.comment.id, LikeType.Comment).subscribe((success) =>{
                el.dismiss();
                if(success){
                  this.onDelete.next(null);
                }
                else
                  this.alert.show("Error", null, "Impossible to delete", ["OK"]);
              },
              (error)=>{
                this.alert.show("Error", null, error, ["OK"]);
                el.dismiss();
              });
            });
           
          }
        }
      ];
    else
      buttons = [{
          text: 'Report as spoiler',
          icon: 'flag',
          data: 10,
          handler: () => {
            this.loader.create({
              message: "Reporting...",
            }).then((el)=>{
              el.present(); 
              this.propaganda.report(this.comment.id, ReportType.Comment, ReportMotivation.Spoiler).subscribe((success) =>{
                el.dismiss();
                if(success)
                  this.alert.show("Done", null, "Thanks for your report, it will be handled by a moderator", ["OK"]);
                else
                  this.alert.show("Error", null, "Something went wrong during report", ["OK"]);
              });
            });

          }
        }
        , {
          text: 'Report as inappropriate',
          icon: 'flag',
          data: 10,
          handler: () => {
            this.loader.create({
              message: "Reporting...",
            }).then((el)=>{
              el.present(); 
              this.propaganda.report(this.comment.id, ReportType.Comment, ReportMotivation.Inappropriate).subscribe((success) =>{
                el.dismiss();
                if(success)
                  this.alert.show("Done", null, "Thanks for your report, it will be handled by a moderator", ["OK"]);
                else
                  this.alert.show("Error", null, "Something went wrong during report", ["OK"]);
              });
            });
            
          }
        },
      ]

    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {}
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Comment options',
      buttons: buttons
    });
    await actionSheet.present();

    // const { role, data } = await actionSheet.onDidDismiss();
  }

  getMessage(comment: Comment){
    if(Translation.has(comment.message)) {
      return Translation.get(comment.message);
    }
    return comment.message;
  }

  visitProfile(author) {
    this.nav.navigateForward(["/profile/", author]);
  }

  onClickOptions() {
    this.presentActionSheet();
  }

  showSpoiler() {
    this.spoiler = false;
  }

}
