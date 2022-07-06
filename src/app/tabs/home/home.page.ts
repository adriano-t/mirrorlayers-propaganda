import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonSegment, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GetMode, Language, Post, Profile, PropagandaService, SortMode } from '../../services/propaganda.service';

@Component({
  selector: 'app-homepage',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy{

  @ViewChild(IonContent) content;
  @ViewChild(IonSegment, {static: true}) segment: IonSegment;
  page = 0;
  enigma = 0;
  enigmas: number[] = []
  languages: Language[] = [
    Language.En,
    Language.It,
    Language.Es,
    Language.Fr,
    Language.De,
    Language.Po,
    Language.Ch,
    Language.Ru,
  ];
  languagesNames: string[] = [
    "English",
    "Italian",
    "Spanish",
    "French",
    "German",
    "Portuguese",
    "Chinese",
    "Russian",
  ];
  posts: Post[];
  profile: Profile;
  sub: Subscription;
  isLoading = false;

  constructor(
    private propaganda: PropagandaService,
    private route: ActivatedRoute,
    private nav: NavController,
  ) {}
    
  ngOnInit(): void {
    this.page = this.route.snapshot.params.page || 0;
    this.sub = this.propaganda.profileCallback.subscribe((data) => {
      this.profile = data;
      if(data == null)
        return;
      this.enigmas = [].constructor(data.enigma + 1);
      this.enigma = this.propaganda.selectedEnigma;
    });     
    
    this.segment.value = this.propaganda.sortMode == SortMode.Date ? "date" : "enigma";
  }
  
  

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ionViewWillEnter() {
      
    this.reloadPosts();
  }

  getLanguageIndex() { 
    return this.languages.indexOf(this.propaganda.language).toString();
  }
  getLanguage(index) {
    if(index < 0)
      return;
    return this.languagesNames[index];
  }

  reloadPosts() {
    this.posts = [];
    this.isLoading = true;
    this.propaganda.getPosts(GetMode.Page, 0, this.page, this.enigma, 0, false, this.propaganda.language, this.propaganda.sortMode).subscribe((result) => {
      this.isLoading = false;
      if(result.success) { 
        this.posts = result.posts;
      } else {
        //@Todo show error
        console.log("TODO: error", result.errors);
      }
    });
  }

  onClickNextPage() { 
    
    let currentPage = this.page; 
    currentPage++;
    
    this.nav.navigateForward(['/tabs/home', currentPage]);    
  }

  onClickPreviousPage() {
    let currentPage = this.page;
    if(currentPage <= 0)
      return;

    currentPage--;
    this.nav.navigateBack(['/tabs/home', currentPage]);
  }

  onChangeEnigma(event){
    this.enigma = +event.detail.value;
    this.propaganda.selectedEnigma = this.enigma;
    this.reloadPosts();
  }

  onChangeLanguage(event){
    this.propaganda.language = this.languages[+event.detail.value];
    this.reloadPosts();
  }


  segmentChanged(event) {
    if(event.detail.value === 'enigma')
      this.propaganda.sortMode = SortMode.Enigma;
    else
      this.propaganda.sortMode = SortMode.Date;

    this.reloadPosts();
  }
 
}
