import { Component } from '@angular/core';
import { GetMode, Language, Post, PropagandaService, SortMode } from '../services/propaganda.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  posts: Post[];
  constructor(private propaganda: PropagandaService) {}

  ionViewWillEnter() {
    console.log('entered view');
    this.propaganda.getPosts(GetMode.Page, 0, 0, 255, 0, false, Language.All, SortMode.Enigma).subscribe((result) => {
      if(result.success) { 
        this.posts = result.posts;
        
      } else {
        //@Todo show error
        console.log("error", result.errors);
      }
    });
  }
}
