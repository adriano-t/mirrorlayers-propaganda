import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonContent, IonGrid } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GetMode, Language, LoginResult, Post, Profile, PropagandaService, SortMode } from '../../services/propaganda.service';

@Component({
  selector: 'app-homepage',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy{

  @ViewChild(IonContent) content;
  page = 0;
  enigma = 0;
  enigmas: number[] = []
  posts: Post[];
  sortMode = SortMode.Date;
  language = Language.En;
  profile: Profile;
  sub: Subscription;
  
  constructor(private propaganda: PropagandaService) {}
    
  ngOnInit(): void {
    this.sub = this.propaganda.profileCallback.subscribe((data) => {
      this.profile = data;
      console.log(data);
      if(data == null)
        return;
      this.enigmas = [].constructor(data.enigma + 1);
      console.log(this.enigmas);
    });  
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ionViewWillEnter() {
      
    this.propaganda.getPosts(GetMode.Page, 0, this.page, this.enigma, 0, false, this.language, this.sortMode).subscribe((result) => {
      if(result.success) { 
        this.posts = result.posts;
        
      } else {
        //@Todo show error
        console.log("error", result.errors);
      }
    });
  }

  reloadPosts() {
    this.propaganda.getPosts(GetMode.Page, 0, this.page, this.enigma, 0, false, this.language, this.sortMode).subscribe((result) => {
      if(result.success) { 
        console.log("reloaded posts");
        this.posts = result.posts;
      } else {
        //@Todo show error
        console.log("error", result.errors);
      }
    });
  }

  onClickNextPage() { 
    
    let currentPage = this.page; 
    currentPage++;
    this.propaganda.getPosts(GetMode.Page, 0, currentPage, this.enigma, 0, false, this.language, this.sortMode).subscribe((result) => {
      if(result.success) { 
        this.posts = result.posts;
        this.page = currentPage;
        this.content.scrollToTop();
      } else {
        //@Todo show error
        console.log("error", result.errors);
      }
    });
    
  }

  onClickPreviousPage() {
    let currentPage = this.page;
    if(currentPage > 0)
      currentPage--;
    
    this.propaganda.getPosts(GetMode.Page, 0, currentPage, this.enigma, 0, false, this.language, this.sortMode).subscribe((result) => {
      if(result.success) { 
        this.posts = result.posts;
        this.page = currentPage;
        this.content.scrollToTop();
      } else {
        //@Todo show error
        console.log("error", result.errors);
      }
    });
  }

  onChangeEnigma(event){
    this.enigma = +event.detail.value;
    console.log(this.enigma);
    this.reloadPosts();
  }

  segmentChanged(event) {
    console.log(event.detail.value);
    if(event.detail.value === 'enigma')
      this.sortMode = SortMode.Enigma;
    else
      this.sortMode = SortMode.Date;

    this.reloadPosts();
  }
 
}
