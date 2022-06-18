import { Component, Input, OnInit, Output } from '@angular/core';
import { ActionSheetController, LoadingController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Comment, LikeType, Profile, PropagandaService } from '../services/propaganda.service';
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

  constructor(private propaganda:PropagandaService,
    private alert: AlertService,
    public actionSheetController: ActionSheetController,
    private loader: LoadingController,
    private nav: NavController,
    ) {}

  ngOnInit() {}

  
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
            console.log('Report spoiler clicked');
          }
        }
        , {
          text: 'Report as inappropriate',
          icon: 'flag',
          data: 10,
          handler: () => {
            console.log('Report Inappropriate clicked');
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
    // console.log('onDidDismiss resolved with role and data', role, data);
  }

  
  visitProfile(author) {
    this.nav.navigateForward(["/profile/", author]);
  }

  onClickOptions() {
    this.presentActionSheet();
  }

}
