import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActionSheetController, IonTextarea, LoadingController, NavController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { Comment, GetMode, LikeType, Post, Profile, PropagandaService } from '../services/propaganda.service';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy{

  @Input() post: Post;
  @Output() onShow = new Subject();
  comments: Comment[];
  commentsOpen = false;
  sub: Subscription;
  profile: Profile;
  isLoading = false;

  constructor(
    private propaganda:PropagandaService,
    private nav: NavController,
    private alert: AlertService,
    private actionSheetController: ActionSheetController,
    private loader: LoadingController) {}


  ngOnInit() {
    this.sub = this.propaganda.profileCallback.subscribe((profile) => {
      this.profile = profile;
      this.onShow.next(null);
    });
  }
 
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  
  reloadComments(mode: GetMode, commentId: number = 0) {
    this.comments = [];
    this.isLoading = true;
    this.propaganda.getComments(mode, commentId, this.post.id, 0).subscribe((response)=>{
      this.isLoading = false;
      if(response.success)
        this.comments = response.comments;
      
      this.commentsOpen = true;
    });
  }

  loadLatestComments(show: boolean) {
    if(show)
      this.commentsOpen = true;
      
  }

  onCommentDelete(){
    this.reloadComments(GetMode.Begin);
    this.post.comments_count--;
  }

  sendComment(elem: IonTextarea) {
    
    this.propaganda.createComment(this.post.id, elem.value, false).subscribe((commentId) => {
      if(!commentId) {
        this.alert.show("Error", null, "Impossible to send comment", ["OK"]);
        return;
      }

     this.reloadComments(GetMode.Range, commentId);
      
    })
    elem.value = "";
  }

  public onClickComments() {

    if(this.commentsOpen){ 
      this.commentsOpen = false;
      return;
    }

    this.propaganda.getComments(GetMode.Begin, 0, this.post.id, 0).subscribe((response)=>{
      if(response.success)
        this.comments = response.comments;
      
      this.commentsOpen = true;
    });
  }

  

  onClickLike() {
    if(this.post.liked)
      return;

    this.propaganda.like(this.post.id, LikeType.Post, true).subscribe((success) => {
      if(success) {
        this.post.liked = true;
        this.post.likes++;
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
    if(this.post.author == this.profile.id)
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
              message: "Deleting...",
            }).then((el)=>{
              el.present();

              this.propaganda.delete(this.post.id, LikeType.Post).subscribe((success) =>{
                console.log("deleting success? ", success);
                el.dismiss();
                if(success)
                  this.nav.navigateRoot("/home");
                else
                  this.alert.show("Error", null, "Impossible to delete", ["OK"]);
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
      handler: () => { }
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Post options',
      buttons: buttons
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  onClickFollow() {
    this.loader.create({
      message: "Loading...",
    }).then((el)=>{
      el.present();
      this.propaganda.follow(this.post.id, !this.post.followed).subscribe(() =>{
          el.dismiss();
          this.post.followed = !this.post.followed;
        });
      });
    }

  onClickOptions() {
    this.presentActionSheet();
  }
}
