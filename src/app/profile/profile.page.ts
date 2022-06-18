import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment, GetMode, Language, Post, Profile, PropagandaService, SortMode } from '../services/propaganda.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profile: Profile;
  posts: Post[];
  comments: Comment[];
  followed: Post[];
  isLoading = false;
  tab = 0;

  genders = [
    "Male",
    "Female",
    "Unknown"
  ]
  constructor(
    private propaganda: PropagandaService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const userId = this.route.snapshot.params.id;

    this.propaganda.getProfile(userId).subscribe((result) => {
      if(result.success) {
        this.profile = result.profile;
        this.loadPosts();
      }
    });

  }

  loadPosts() {
    if(this.isLoading)
      return;
    this.isLoading = true;
    this.propaganda.getPosts(GetMode.Begin, 0, 0, 255, this.profile.id, false, Language.All, SortMode.Enigma).subscribe((result) => {
      if (result.success) {
        this.isLoading = false;
        this.posts = result.posts;
        console.log(this.posts);
      }
    });
  }

  loadComments() {
    if(this.isLoading)
      return;
    this.isLoading = true;
    this.propaganda.getComments(GetMode.Begin, 0, 0, this.profile.id).subscribe((result) => {
      this.isLoading = false;
      if (result.success) {
        this.comments = result.comments;
        console.log(this.comments);
      }
    });
  }

  loadFollowed() {
    if(this.isLoading)
      return;
    this.isLoading = true;
    this.propaganda.getPosts(GetMode.Begin, 0, 0, 255, this.profile.id, true, Language.All, SortMode.Enigma).subscribe((result) => {
      if (result.success) {
        this.isLoading = false;
        this.posts = result.posts;
        console.log(this.posts);
      }
    });
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
        this.loadPosts();
        break;
        
      case "comments":
        this.tab = 1;
        this.loadComments();
        break;
        
      case "followed":
        this.tab = 2;
        this.loadFollowed();
        break;
    }
  }

}
