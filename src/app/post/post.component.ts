import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'; 
import { AlertController, IonGrid, IonTextarea } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LikeType, Post, Comment, PropagandaService, SortMode, GetMode, Profile } from '../services/propaganda.service';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy{

  @Input() post: Post;
  comments: Comment[];
  commentsOpen = false;
  sub: Subscription;
  profile: Profile;

  constructor(private propaganda:PropagandaService,
    private alert: AlertService) { }

  ngOnInit() {
    this.sub = this.propaganda.profileCallback.subscribe((profile) => {
      this.profile = profile;
    })
  }
 
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  
  sendComment(elem: IonTextarea) {
    console.log(elem.value);
    this.propaganda.createComment(this.post.id, elem.value, false).subscribe((commentId) => {
      if(!commentId) {
        this.alert.show("Error", null, "Impossible to send comment", ["OK"]);
        return;
      }

      this.propaganda.getComments(GetMode.Range, commentId, this.post.id, 0).subscribe((response)=>{
        if(response.success)
          this.comments = response.comments;
        
        this.commentsOpen = true;
      });
      
    })
    elem.value = "";
  }

  onClickComments() {

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

  onClickFollow() {

  } 
}
