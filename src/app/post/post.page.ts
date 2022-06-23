import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetMode, Language, Post, PropagandaService, SortMode } from '../services/propaganda.service';
import { PostComponent } from './post.component';

@Component({
  selector: 'app-page-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  post: Post;
  error: string;

  @ViewChild(PostComponent, {static: false}) postComponent;

  constructor(
    private propaganda: PropagandaService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propaganda.getPosts(GetMode.Exact, params.id, 0, 255, 0, false, Language.All, SortMode.Date).subscribe(result => {
        if(result.success) {
          if(result.posts.length > 0){
            this.post = result.posts[0];
          }
          else
            this.error = "Could not find post";
        }
        else
          this.error = "Server error, try to reload";
      })

    });
  }

  onPostShow(component: PostComponent) {
    component.onClickComments();
  }

}
