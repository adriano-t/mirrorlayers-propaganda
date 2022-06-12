import { Component, Input, OnInit } from '@angular/core';
import { Comment, LikeType, PropagandaService } from '../services/propaganda.service';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
 
  @Input() comment: Comment;
  
  constructor(private propaganda:PropagandaService,
    private alert: AlertService) { }

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


}
