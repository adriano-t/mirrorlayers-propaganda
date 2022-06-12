import { Component, Input, OnInit, ViewChild } from '@angular/core'; 
import { AlertController, IonGrid } from '@ionic/angular';
import { LikeType, Post, Comment, PropagandaService, SortMode, GetMode } from '../services/propaganda.service';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  comments: Comment[];
  commentsOpen = false;

  constructor(private propaganda:PropagandaService,
    private alert: AlertService) { }

  ngOnInit() {}
 
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
