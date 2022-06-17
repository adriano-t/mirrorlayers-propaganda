import { Component } from '@angular/core';
import { IonSearchbar, NavController } from '@ionic/angular';
import { GetProfileResult, Profile, ProfileSearch, PropagandaService, SearchResult } from 'src/app/services/propaganda.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage {

  profiles: ProfileSearch[];
  isLoading = false;
  minChars = 2;

  constructor(
    private propaganda: PropagandaService,
    private nav: NavController,
  ) {}

  onSearch(event){
    const bar: IonSearchbar = event.target;
    const name = bar.value;
    if(name.length < this.minChars)
      return;

    this.profiles = [];
    this.isLoading = true;
    this.propaganda.searchProfile(name).subscribe((result: SearchResult) => {
      
      this.isLoading = false;
      if(result.success)
        this.profiles = result.profiles;
    });
    
    console.log(bar.value);
  }

  onClick(profile) {
    console.log(profile);
    this.nav.navigateForward(['/profile/', profile.id]);
  }
}
