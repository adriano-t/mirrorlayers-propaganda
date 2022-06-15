import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsPage } from './notifications.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { NotificationsPageRoutingModule } from './notifications-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: NotificationsPage }]),
    NotificationsPageRoutingModule,
    SharedModule
  ],
  declarations: [NotificationsPage]
})
export class NotificationsPageModule {}
