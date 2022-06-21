import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { Comment, GetMode, Language, Post, Profile, PropagandaService, ReportMotivation, ReportType, SortMode } from '../services/propaganda.service';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profile: Profile;
  me: Profile;
  posts: Post[];
  comments: Comment[];
  followed: Post[];
  isLoading = false;
  tab = 0;
  minId = 1;
  canLoadMore = false;

  genders = [
    "Male",
    "Female",
    "Unknown"
  ]

  constructor(
    private propaganda: PropagandaService,
    private route: ActivatedRoute,
    private loader: LoadingController,
    private actionSheetController: ActionSheetController,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    const userId = this.route.snapshot.params.id;

    this.propaganda.getProfile(userId).subscribe((result) => {
      if(result.success) {
        this.profile = result.profile;
        this.loadPosts(GetMode.Begin, 0);
      }
    });

    this.propaganda.profileCallback.subscribe(profile => {
      this.me = profile;
    })

  }

  loadPosts(mode: GetMode, id: number) {
    if(this.isLoading)
      return;
    this.isLoading = true; 
    this.propaganda.getPosts(mode, id, 0, 255, this.profile.id, false, Language.All, SortMode.Enigma).subscribe((result) => {
      
      this.isLoading = false;
      if (result.success) {
        if(mode == GetMode.Before)
          this.posts.push(...result.posts);
        else
          this.posts = result.posts;
      }

      this.canLoadMore = result.posts?.length >= 10;
      
      //update last id
      this.minId = Number.MAX_SAFE_INTEGER;
      this.posts?.forEach(post => {
        if(+post.id < +this.minId)
          this.minId = post.id;
      });
    });

  }

  loadComments(mode: GetMode, id: number) {
    if(this.isLoading)
      return; 
    this.isLoading = true;
    this.propaganda.getComments(mode, id, 0, this.profile.id).subscribe((result) => {
      this.isLoading = false;
      if (result.success) { 
        if(mode == GetMode.Before)
          this.comments.push(...result.comments);
        else
          this.comments = result.comments;
      }
      
      this.canLoadMore = result.comments?.length >= 10;
      //update last id
      this.minId = Number.MAX_SAFE_INTEGER;
      this.comments?.forEach(comment => {
        if(+comment.id < +this.minId){
          this.minId = comment.id;
        }
      });
    });
  }

  loadFollowed(mode: GetMode, id: number) {
    if(this.isLoading)
      return;
    this.isLoading = true;
    this.propaganda.getPosts(mode, id, 0, 255, this.profile.id, true, Language.All, SortMode.Enigma).subscribe((result) => {
      this.isLoading = false;
      if (result.success) {
        if(mode == GetMode.Before)
          this.followed.push(...result.posts);
        else
          this.followed = result.posts;
      }

      this.canLoadMore = result.posts?.length >= 10;
      
      //update last id
      this.minId = Number.MAX_SAFE_INTEGER;
      this.followed?.forEach(post => {
        if(+post.id < +this.minId)
          this.minId = post.id;
      });
    });
  }

  loadMore() {
    if(this.isLoading)
      return;

    switch(this.tab) {
      case 0:
        this.loadPosts(GetMode.Before, this.minId);
        break;
      case 1:
        this.loadComments(GetMode.Before, this.minId);
        break;
      case 2:
        this.loadFollowed(GetMode.Before, this.minId);
        break;
    }
  }

  onCommentDelete() {
    console.log("deleted comment");
    //todo refresh
  }

  segmentChanged(event) {
    console.log(event.detail.value);
    switch(event.detail.value) {
      case "posts":
        this.tab = 0;
        this.loadPosts(GetMode.Begin, 0);
        break;
        
      case "comments":
        this.tab = 1;
        this.loadComments(GetMode.Begin, 0);
        break;
        
      case "followed":
        this.tab = 2;
        this.loadFollowed(GetMode.Begin, 0);
        break;
    }
  }


  onClickOptions() {
    this.presentActionSheet();
  }

  async presentActionSheet() {

    const buttons = [{
          text: 'Report profile',
          icon: 'flag',
          data: 10,
          handler: () => {
            console.log('Report Inappropriate clicked');

            this.loader.create({
              message: "Reporting...",
            }).then((el)=>{
              el.present(); 
              this.propaganda.report(this.profile.id, ReportType.Profile, ReportMotivation.Inappropriate).subscribe((success) =>{
                console.log("deleting success? ", success);
                el.dismiss();
                if(success)
                  this.alert.show("Done", null, "Thanks for your report, it will be handled by a moderator", ["OK"]);
                else
                  this.alert.show("Error", null, "Something went wrong during report", ["OK"]);
              });
            });
            
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {}
        }
      ]
 

    const actionSheet = await this.actionSheetController.create({
      header: 'Comment options',
      buttons: buttons
    });
    await actionSheet.present();

    // const { role, data } = await actionSheet.onDidDismiss();
    // console.log('onDidDismiss resolved with role and data', role, data);
  }

}
