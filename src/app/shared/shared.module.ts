 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { IonicModule } from '@ionic/angular';
import { AvatarPipe } from '../avatar.pipe';
@NgModule({
  imports: [
    CommonModule, 
    IonicModule
  ],
  declarations: [
    PostComponent, 
    AvatarPipe
  ],
  exports: [
    PostComponent, 
    AvatarPipe,
  ]
})
export class SharedModule {}
