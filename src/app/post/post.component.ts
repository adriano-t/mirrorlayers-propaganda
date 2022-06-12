import { Component, Input, OnInit } from '@angular/core'; 
import { AlertController } from '@ionic/angular';
import { LikeType, Post, PropagandaService } from '../services/propaganda.service';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  @Input() post: Post;

  constructor(private propaganda:PropagandaService,
    private alert: AlertService) { }

  ngOnInit() {}
 
  onClickComments() {
    //this.propaganda.loadComments().subscribe();
  }

  async onClickLike() {
    if(this.post.liked)
      return;

    this.propaganda.like(this.post.id, LikeType.Post, true).subscribe((success) => {
      if(success) {
        this.post.liked = true;
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
