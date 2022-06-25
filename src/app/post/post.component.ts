import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActionSheetController, IonTextarea, LoadingController, NavController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { Comment, GetMode, LikeType, Post, Profile, PropagandaService, ReportMotivation, ReportType } from '../services/propaganda.service';
import { Translation } from '../services/Translation.model';
import { AlertService } from '../shared/alert.service';
import { FilepickerService } from '../shared/filepicker/filepicker.service';

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
  minCommentId = 1;
  maxCommentId = 1;
  canLoadNext = true;
  canLoadPrevious = false;
  spoiler = false;
  spoilerMessage = "May contain spoilers";
  laterEnigma = false;
  filename = undefined;

  constructor(
    private propaganda:PropagandaService,
    private nav: NavController,
    private alert: AlertService,
    private actionSheetController: ActionSheetController,
    private loader: LoadingController,
    private picker: FilepickerService,
    ) {}


  ngOnInit() {
    this.sub = this.propaganda.profileCallback.subscribe((profile) => {
      this.profile = profile;
      this.onShow.next(null);
     
      this.laterEnigma = +this.post.enigma > +this.profile.enigma || 
      (+this.post.enigma == +this.profile.enigma && +this.post.section > +this.profile.section);
  
      if(this.spoiler) {
        this.spoilerMessage = "May contain spoilers";
      } else if (this.laterEnigma) {
        this.spoilerMessage = "Sent from a later Enigma";
      }
       this.spoiler = this.post.spoiler || this.laterEnigma;
    });
  }
 
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadNext() {
    this.reloadComments(GetMode.After, this.maxCommentId);
  }

  loadPrevious() {  
    this.reloadComments(GetMode.Before, this.minCommentId);
  }

  reloadComments(mode: GetMode, commentId: number = 0) {

    if(mode != GetMode.Before && mode != GetMode.After)
      this.comments = [];

    this.isLoading = true;
    this.propaganda.getComments(mode, commentId, this.post.id, 0).subscribe((response)=>{
      this.isLoading = false;
      if(response.success) {
        if(mode == GetMode.Range) { 
          this.canLoadPrevious = response.comments.length >= 5;
          this.comments = response.comments;
        } else if(mode == GetMode.Before) {
          this.comments.unshift(...response.comments);
          this.canLoadPrevious = response.comments.length > 0;
        } else if ( mode == GetMode.After) {
          this.comments.push(...response.comments);
          this.canLoadNext = response.comments.length > 10;
        } else {
          this.comments = response.comments;
        }
      }
      
      this.commentsOpen = true;
      
      //refresh min-max
      this.maxCommentId = 1;
      this.minCommentId = Number.MAX_SAFE_INTEGER;
      this.comments?.forEach(comment => {
        if(+comment.id > +this.maxCommentId)
          this.maxCommentId = comment.id;
        if (+comment.id < +this.minCommentId)
          this.minCommentId = comment.id;
      });
    });
  } 

  onCommentDelete(){
    this.reloadComments(GetMode.Begin);
    this.post.comments_count--;
  }

  sendComment(elem: IonTextarea) { 
    this.loader.create({
      message: "Sending",
    }).then(el => {
      el.present(); 
      this.propaganda.createComment(this.post.id, elem.value, false, this.filename).subscribe((commentId) => {
        el.dismiss();
        if(!commentId) {
          this.alert.show("Error", null, "Impossible to send comment", ["OK"]);
          return;
        }
  
        this.reloadComments(GetMode.Range, commentId);
      });
      elem.value = "";
      this.filename = undefined;
    });   
  }

  public showComments(commentId: number) {
    
    this.commentsOpen = true;

    if(commentId > 0) {
      this.reloadComments(GetMode.Range, commentId);
    } else {
      this.reloadComments(GetMode.Begin, 0);
    }
  }

  public onClickComments() {

    if(this.commentsOpen){ 
      this.commentsOpen = false;
      return;
    }

    this.reloadComments(GetMode.Begin, 0);
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
            this.loader.create({
              message: "Reporting...",
            }).then((el)=>{
              el.present();

              this.propaganda.report(this.post.id, ReportType.Post, ReportMotivation.Spoiler).subscribe((success) =>{
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

              this.propaganda.report(this.post.id, ReportType.Post, ReportMotivation.Inappropriate).subscribe((success) =>{
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
      handler: () => { }
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Post options',
      buttons: buttons
    });
    await actionSheet.present();

    // const { role, data } = await actionSheet.onDidDismiss();
  }

  getMessage(post: Post){
    if(Translation.has(post.message)) {
      return Translation.get(post.message);
    }
    return post.message;
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

  visitProfile(author) {
    this.nav.navigateForward(["/profile/", author]);
  }

  onClickOptions() {
    this.presentActionSheet();
  }

  showSpoiler() {
    this.spoiler = false;
  }
  
  pickFile() {
    this.picker.get().then(filename => {
      this.filename = filename;
    })
  }

  clearFile() {
    this.filename = undefined;
  }
}
