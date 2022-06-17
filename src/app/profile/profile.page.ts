import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProfileResult, Profile, PropagandaService } from '../services/propaganda.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profile: Profile;

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
      }
    });
  }

  segmentChanged(event) {
    console.log(event.detail.value);
    
  }

}
